import { pool } from './db';

async function log(msg: string) {
  console.log(`[Migrations] ${msg}`);
}

async function col(table: string, column: string): Promise<{ exists: boolean; type: string; nullable: boolean }> {
  const r = await pool.query(
    `SELECT data_type, is_nullable FROM information_schema.columns
     WHERE table_name = $1 AND column_name = $2`,
    [table, column]
  );
  if (!r.rows[0]) return { exists: false, type: '', nullable: true };
  return {
    exists: true,
    type: r.rows[0].data_type,
    nullable: r.rows[0].is_nullable === 'YES',
  };
}

async function tableExists(table: string): Promise<boolean> {
  const r = await pool.query(
    `SELECT 1 FROM information_schema.tables WHERE table_name = $1`,
    [table]
  );
  return (r.rowCount ?? 0) > 0;
}

// ─── appointments ──────────────────────────────────────────────────────────────

async function migrateAppointments() {
  const exists = await tableExists('appointments');
  if (!exists) {
    await pool.query(`
      CREATE TABLE appointments (
        id                      SERIAL PRIMARY KEY,
        name                    TEXT NOT NULL,
        email                   TEXT NOT NULL,
        phone                   TEXT,
        reason                  TEXT NOT NULL DEFAULT '',
        date                    DATE,
        slot_id                 INTEGER,
        start_time              TEXT,
        end_time                TEXT,
        platform                TEXT NOT NULL DEFAULT 'zoom',
        appointment_type        TEXT NOT NULL DEFAULT 'paid_service',
        status                  TEXT NOT NULL DEFAULT 'pending',
        payment_status          TEXT NOT NULL DEFAULT 'unpaid',
        stripe_payment_intent_id TEXT,
        stripe_session_id       TEXT,
        meet_link               TEXT,
        language                TEXT,
        was_rescheduled         BOOLEAN NOT NULL DEFAULT FALSE,
        created_at              TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    log('Created appointments table');
    return;
  }

  // Fix date column: convert from timestamp to date if needed
  const dateCol = await col('appointments', 'date');
  if (dateCol.exists) {
    const isTs = dateCol.type === 'timestamp without time zone' || dateCol.type === 'timestamp with time zone';
    if (isTs) {
      await pool.query(`ALTER TABLE appointments ALTER COLUMN date TYPE date USING date::date`);
      log('Converted appointments.date from timestamp → date');
    }
    if (!dateCol.nullable) {
      await pool.query(`ALTER TABLE appointments ALTER COLUMN date DROP NOT NULL`);
      log('Dropped NOT NULL on appointments.date');
    }
  }

  // Add any missing columns (idempotent)
  const addCols: [string, string][] = [
    ['phone',                    'TEXT'],
    ['slot_id',                  'INTEGER'],
    ['start_time',               'TEXT'],
    ['end_time',                 'TEXT'],
    ['stripe_payment_intent_id', 'TEXT'],
    ['stripe_session_id',        'TEXT'],
    ['meet_link',                'TEXT'],
    ['language',                 'TEXT'],
  ];
  for (const [name, type] of addCols) {
    const c = await col('appointments', name);
    if (!c.exists) {
      await pool.query(`ALTER TABLE appointments ADD COLUMN ${name} ${type}`);
      log(`Added appointments.${name}`);
    }
  }

  // was_rescheduled: boolean NOT NULL DEFAULT FALSE
  const wasSched = await col('appointments', 'was_rescheduled');
  if (!wasSched.exists) {
    await pool.query(`ALTER TABLE appointments ADD COLUMN was_rescheduled BOOLEAN NOT NULL DEFAULT FALSE`);
    log('Added appointments.was_rescheduled');
  }
}

// ─── availability_slots ────────────────────────────────────────────────────────

async function migrateAvailabilitySlots() {
  const exists = await tableExists('availability_slots');
  if (!exists) {
    await pool.query(`
      CREATE TABLE availability_slots (
        id         SERIAL PRIMARY KEY,
        date       DATE NOT NULL,
        start_time TEXT NOT NULL,
        end_time   TEXT NOT NULL,
        is_booked  BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    log('Created availability_slots table');
    return;
  }

  // Remove any null-dated legacy rows
  const del = await pool.query(`DELETE FROM availability_slots WHERE date IS NULL`);
  if ((del.rowCount ?? 0) > 0) log(`Removed ${del.rowCount} null-dated availability slot(s)`);

  // Enforce NOT NULL on date column
  const dateCol = await col('availability_slots', 'date');
  if (dateCol.exists && dateCol.nullable) {
    await pool.query(`ALTER TABLE availability_slots ALTER COLUMN date SET NOT NULL`);
    log('Enforced NOT NULL on availability_slots.date');
  }
}

// ─── leads ────────────────────────────────────────────────────────────────────

async function migrateLeads() {
  const exists = await tableExists('leads');
  if (!exists) {
    await pool.query(`
      CREATE TABLE leads (
        id           SERIAL PRIMARY KEY,
        email        TEXT NOT NULL,
        summary      TEXT,
        segment      TEXT,
        primary_goal TEXT,
        created_at   TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    log('Created leads table');
    return;
  }

  const extraCols: [string, string][] = [
    ['segment',      'TEXT'],
    ['primary_goal', 'TEXT'],
    ['summary',      'TEXT'],
  ];
  for (const [name, type] of extraCols) {
    const c = await col('leads', name);
    if (!c.exists) {
      await pool.query(`ALTER TABLE leads ADD COLUMN ${name} ${type}`);
      log(`Added leads.${name}`);
    }
  }
}

// ─── Runner ────────────────────────────────────────────────────────────────────

export async function runMigrationsOnStartup() {
  try {
    log('Running schema migrations…');
    await migrateAppointments();
    await migrateAvailabilitySlots();
    await migrateLeads();
    log('All migrations complete ✓');
  } catch (err: any) {
    console.error('[Migrations] FATAL migration error:', err.message);
    throw err;
  }
}
