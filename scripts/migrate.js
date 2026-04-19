/**
 * Database migration script — runs before server boot on every deployment.
 * Plain ESM so it works with "type": "module" and requires no compilation.
 * All statements are idempotent: safe to run multiple times.
 */

import pg from 'pg';

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('[migrate] DATABASE_URL is not set — skipping migrations.');
  process.exit(0);
}

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

function log(msg) {
  console.log(`[migrate] ${msg}`);
}

async function colInfo(client, table, column) {
  const r = await client.query(
    `SELECT data_type, is_nullable
     FROM information_schema.columns
     WHERE table_name = $1 AND column_name = $2`,
    [table, column]
  );
  return r.rows[0] ?? null;
}

async function tableExists(client, table) {
  const r = await client.query(
    `SELECT 1 FROM information_schema.tables WHERE table_name = $1`,
    [table]
  );
  return (r.rowCount ?? 0) > 0;
}

// ─── appointments ──────────────────────────────────────────────────────────────

async function migrateAppointments(client) {
  const exists = await tableExists(client, 'appointments');
  if (!exists) {
    await client.query(`
      CREATE TABLE appointments (
        id                       SERIAL PRIMARY KEY,
        name                     TEXT NOT NULL,
        email                    TEXT NOT NULL,
        phone                    TEXT,
        reason                   TEXT NOT NULL DEFAULT '',
        date                     DATE,
        slot_id                  INTEGER,
        start_time               TEXT,
        end_time                 TEXT,
        platform                 TEXT NOT NULL DEFAULT 'zoom',
        appointment_type         TEXT NOT NULL DEFAULT 'paid_service',
        status                   TEXT NOT NULL DEFAULT 'pending',
        payment_status           TEXT NOT NULL DEFAULT 'unpaid',
        stripe_payment_intent_id TEXT,
        stripe_session_id        TEXT,
        meet_link                TEXT,
        language                 TEXT,
        was_rescheduled          BOOLEAN NOT NULL DEFAULT FALSE,
        created_at               TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    log('Created appointments table.');
    return;
  }

  // Fix date column: convert timestamp → date if needed
  const dateCol = await colInfo(client, 'appointments', 'date');
  if (dateCol) {
    const isTs = dateCol.data_type === 'timestamp without time zone' || dateCol.data_type === 'timestamp with time zone';
    if (isTs) {
      await client.query(`ALTER TABLE appointments ALTER COLUMN date TYPE date USING date::date`);
      log('Converted appointments.date from timestamp → date.');
    }
    if (dateCol.is_nullable === 'NO') {
      await client.query(`ALTER TABLE appointments ALTER COLUMN date DROP NOT NULL`);
      log('Dropped NOT NULL on appointments.date.');
    }
  }

  // Add any missing columns
  const cols = [
    ['phone',                    'TEXT'],
    ['slot_id',                  'INTEGER'],
    ['start_time',               'TEXT'],
    ['end_time',                 'TEXT'],
    ['stripe_payment_intent_id', 'TEXT'],
    ['stripe_session_id',        'TEXT'],
    ['meet_link',                'TEXT'],
    ['language',                 'TEXT'],
  ];
  for (const [name, type] of cols) {
    const c = await colInfo(client, 'appointments', name);
    if (!c) {
      await client.query(`ALTER TABLE appointments ADD COLUMN ${name} ${type}`);
      log(`Added appointments.${name}`);
    }
  }

  // was_rescheduled — boolean NOT NULL DEFAULT FALSE
  const wasSched = await colInfo(client, 'appointments', 'was_rescheduled');
  if (!wasSched) {
    await client.query(`ALTER TABLE appointments ADD COLUMN was_rescheduled BOOLEAN NOT NULL DEFAULT FALSE`);
    log('Added appointments.was_rescheduled');
  }
}

// ─── availability_slots ────────────────────────────────────────────────────────

async function migrateAvailabilitySlots(client) {
  const exists = await tableExists(client, 'availability_slots');
  if (!exists) {
    await client.query(`
      CREATE TABLE availability_slots (
        id         SERIAL PRIMARY KEY,
        date       DATE NOT NULL,
        start_time TEXT NOT NULL,
        end_time   TEXT NOT NULL,
        is_booked  BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    log('Created availability_slots table.');
    return;
  }

  // Clean up null-dated legacy rows
  const del = await client.query(`DELETE FROM availability_slots WHERE date IS NULL`);
  if ((del.rowCount ?? 0) > 0) log(`Removed ${del.rowCount} null-dated availability slot(s).`);

  // Enforce NOT NULL on date
  const dateCol = await colInfo(client, 'availability_slots', 'date');
  if (dateCol?.is_nullable === 'YES') {
    await client.query(`ALTER TABLE availability_slots ALTER COLUMN date SET NOT NULL`);
    log('Enforced NOT NULL on availability_slots.date.');
  }
}

// ─── leads ────────────────────────────────────────────────────────────────────

async function migrateLeads(client) {
  const exists = await tableExists(client, 'leads');
  if (!exists) {
    await client.query(`
      CREATE TABLE leads (
        id           SERIAL PRIMARY KEY,
        email        TEXT NOT NULL,
        summary      TEXT,
        segment      TEXT,
        primary_goal TEXT,
        created_at   TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    log('Created leads table.');
    return;
  }

  for (const [name, type] of [['segment', 'TEXT'], ['primary_goal', 'TEXT'], ['summary', 'TEXT']]) {
    const c = await colInfo(client, 'leads', name);
    if (!c) {
      await client.query(`ALTER TABLE leads ADD COLUMN ${name} ${type}`);
      log(`Added leads.${name}`);
    }
  }
}

// ─── Runner ────────────────────────────────────────────────────────────────────

async function main() {
  log('Starting database migrations…');
  const client = await pool.connect();
  try {
    await migrateAppointments(client);
    await migrateAvailabilitySlots(client);
    await migrateLeads(client);
    log('All migrations complete ✓');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('[migrate] FATAL:', err.message);
  process.exit(1);
});
