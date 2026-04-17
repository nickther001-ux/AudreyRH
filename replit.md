# Audrey Mondesir - Career Consultation Website

## Overview
A professional bilingual (French/English) consultation website for Audrey Mondesir, CRIA (Certified Industrial Relations Advisor), providing career strategy guidance for newcomers to Quebec. Features booking system with Stripe payment integration ($80 initial consultation).

## Project Structure
- `client/` - React frontend with Vite
- `server/` - Express backend
- `shared/` - Shared types and schemas
- `drizzle.config.ts` - Database configuration
- `client/src/lib/i18n.tsx` - Bilingual translations (French/English)

## Key Features
- Professional landing page with Montreal cityscape hero
- Full bilingual support (French/English) with language toggle
- Service cards with detailed information dialogs
- Redesigned booking page with hero banner, sticky sidebar, and step-based form
- Booking system with platform selection (Zoom/Google Meet)
- Stripe payment integration
- Admin page for managing availability (/admin) — beach background, approve/reject/reschedule bookings
- Terms & Conditions page (/terms)
- Social media links (TikTok, LinkedIn)

## Database Schema
- `appointments` - Stores booking information with payment status
- `availability_slots` - Stores Audrey's available time blocks

## Routes
- `/` - **Gateway** homepage with two entry tiles (For Individuals / For Businesses)
- `/individuals` - Individual services page (career consulting, packages, about, testimonials)
- `/business` - Business solutions page (HR strategy, talent acquisition, grants, compliance)
- `/book` - Booking page with available time slots
- `/admin` - Admin page for managing availability
- `/terms` - Terms & Conditions page
- `/grants` - Grants & Funding portal (4 categories: Artists, Entrepreneurs, SMEs, Corporate)
- `/faq` - FAQ page (4 categories: Général, Consultation, Particuliers, Entreprises — accordion with 16 bilingual Q&As)
- `/contact` - Simple contact form (name, email, subject, message) → sends to Audrey via /api/contact-simple

## User Preferences
- Currency: USD ($50)
- Languages: French (default) and English
- Platform options: Zoom or Google Meet

## Design System
- **consulting.framer.media-inspired palette**: Forest green primary (#239b56), near-black foreground (#111), pure white backgrounds, orange brand accent
- CSS variables: `--primary: 148 65% 40%`, `--foreground: 0 0% 7%` (near-black), `--background: 0 0% 100%`
- Montreal cityscape background in hero sections with near-black overlay
- NO dark animated sections — all sections are clean white or light gray (consulting aesthetic)
- CTA sections: solid `bg-primary` green with white text and white CTA buttons
- Modal headers: bg-foreground (near-black), green primary accent buttons
- Sticky sidebar for consultation details on booking page
- Navbar: transparent over hero, white with green brand on scroll
- Footer: near-black background (via --foreground)

## AI Chat Widget
- Floating chat bubble (bottom-right, navy/blue gradient) powered by Gemini 2.5 Flash
- `server/gemini.ts` — Gemini client with Audrey's system prompt; bilingual (FR/EN auto-detect)
- `POST /api/chat` — accepts `messages[]`, returns Gemini reply
- `POST /api/chat/lead` — saves email + chat summary to `leads` table; triggers Resend notification to Audrey
- `leads` table created via startup migration in `server/index.ts` (raw SQL, `CREATE TABLE IF NOT EXISTS`)
- `client/src/components/AIChatWidget.tsx` — floating widget with message bubbles, quick-chip suggestions, auto-lead capture when user types their email
- Widget registered globally in `App.tsx` (above `<PrivacyConsent />`)
- `GEMINI_API_KEY` secret required (already set)

## Recent Changes
- 2026-04-15: Added "Consultation Entreprise" third booking mode at $250 CAD — `business_consultation` appointmentType in schema/validators; Stripe checkout creates a 25000-cent CAD session; Book.tsx has 3-column tab grid with Briefcase icon, 60-90 min duration, business preparation checklist, and "Payer 250$ CAD" button; full FR/EN translations added.
- 2026-04-15: Replaced Drizzle ORM INSERT/UPDATE for appointments with raw parameterized SQL — root cause of "column name does not exist" in production was Drizzle's compiled bundle using stale/wrong column names; raw SQL bypasses this entirely and guarantees correct column names.
- 2026-04-15: Fixed free consultation booking — `appointments.date` made nullable in schema + `db:push`; `insertAppointmentSchema.date` changed to `z.coerce.date().optional()`; `Appointment.date` typed as `string | null`; `storage.createAppointment` handles null date; paid bookings enforce slot selection via `form.setError("date")` in `onSubmit` instead of Zod; hook error message now reads actual server JSON body instead of hardcoding "Failed to create appointment".
- 2026-04-15: Fixed POST /api/appointments 500 error — three fixes: (1) catch block now exposes actual error message in response (err?.message instead of generic "Failed to create appointment"); (2) appointments.date column changed from timestamp("date") to date("date") — same Drizzle mapToDriverValue T/Z null bug as availability_slots; createAppointment and rescheduleAppointment now pass "yyyy-MM-dd" strings bypassing Drizzle serializer; npm run db:push applied; (3) email sending already isolated in its own try/catch — DB insert can never fail due to email error.
- 2026-04-15: Fixed root cause of date=null bug — Drizzle's timestamp mapToDriverValue sends .toISOString() ("T...Z") which PostgreSQL TIMESTAMP WITHOUT TIME ZONE silently nulls. 4 fixes: (1) shared/schema.ts: changed availability_slots.date from timestamp("date") to date("date") (PostgreSQL DATE type accepts plain "yyyy-MM-dd" strings natively); (2) shared/validators.ts: AvailabilitySlot.date type changed from Date to string (Drizzle date() column returns strings); (3) server/storage.ts: createAvailabilitySlot now passes a plain "yyyy-MM-dd" string (not a Date) to the insert; all date comparisons use todayString="yyyy-MM-dd" format; (4) npm run db:push: ALTERed the column from TIMESTAMP to DATE. Startup cleanup removes all legacy null-dated rows on boot.
- 2026-04-15: Rewrote admin slot onSubmit as single async try/catch — removed useMutation for slot creation; onSubmit now uses format(date,'yyyy-MM-dd') for payload (no localized strings), strict if(!res.ok) throw check, and success toast/reset only fire at the bottom of the try block after confirmed 201. isCreating managed via useState. Any server error shows a red toast with the exact server message.
- 2026-04-15: Fixed slot date=null production bug — 4-layer defense: (1) Frontend mutationFn explicitly converts Date to ISO string and validates before sending; (2) Calendar onSelect guards against undefined (prevents date-cleared edge case); (3) POST route checks for missing/invalid date before Zod parse and returns 400; (4) storage.createAvailabilitySlot validates normalizedDate is not NaN, throws on null return from DB. Startup migration (fixAvailabilitySchema in index.ts): deletes null-dated slots and ALTERs date column to SET NOT NULL if production DB column is still nullable.
- 2026-04-15: Fixed admin slot list empty bug — root cause: /api/admin/availability route used dynamic `import('drizzle-orm')` which can fail silently in production bundles. Fix: moved admin slots query into `storage.getAdminSlots()` (static imports, isNotNull filter, UTC midnight comparison). Stats counter now counts from groupedSlots (displayable slots) instead of safeSlots (raw API array), so counter always matches the panel. Added slots debug useEffect console.log.
- 2026-04-15: Fixed admin slot creation — all 5 issues resolved: (1) mutationFn now uses fetch directly for clean JSON error extraction; (2) onError shows exact DB error message in red toast; (3) backend logs slot create/fetch with console.log; (4) onSuccess uses refetchQueries for immediate UI update + confirmation toast with startTime–endTime; (5) all date comparisons use UTC midnight (Date.UTC) and slots are normalized to noon UTC on insert to prevent timezone boundary issues.
- 2026-04-15: Redesigned contact notification email (sendSimpleContactEmail) — replaced dense dark navy template with clean light layout: light gray page wrapper (#f0f2f5), white card, forest green (#239b56) header, organized De/Sujet/Message cards with green left-border accent on message, green reply button. Also fixed Admin.tsx parseLocalDate to be null-safe and added debug useEffect console.log for raw appointment data.
- 2026-04-14: Fixed /book blank page in production — production DB had availability slots with `date: null`. Fixed `parseLocalDate()` to guard against null, added `if (!slot.date) return acc` in SlotPicker reduce, and added `isNotNull(availabilitySlots.date)` to both public and admin availability queries to exclude null-dated slots at DB level.
- 2026-04-14: Fixed contact form 500 in production — `resend` added to server bundle allowlist (was incorrectly treated as external, failing silently in deployed env). Also fixed missing `emailWrapperClose` in `sendSimpleContactEmail`.
- 2026-04-14: Admin major overhaul — beach AVIF background, midnight blue palette, stats strip, approve/reject/reschedule buttons with email notifications, reschedule dialog with controlled calendar popover, logout button, Calendly section
- 2026-04-06: Grants.tsx full rewrite — Stratwell Consulting editorial dark layout: full-height hero with italic accent word in #93c5fd, 4-up animated stat strip, 2×2 photo-backed grant card grid with hover zoom, numbered dark process steps (01-04), horizontal scroll testimonial carousel with prev/next arrows, midnight-blue final CTA. Diagnostic modal preserved with updated styling.
- 2026-04-02: Full homepage redesign — pixel-level clone of consulting.framer.media with AudreyRH content
- 2026-01-11: Redesigned booking page with hero banner, sticky sidebar, and numbered step sections
- 2026-01-11: Added bilingual Terms & Conditions page (/terms)
- 2026-01-11: Fixed duplicate translation keys in i18n.tsx
- 2026-01-11: Added comprehensive bilingual support throughout application

## Homepage Layout (Portal Gateway)
Home.tsx (/) — clean full-screen split portal, archio editorial style:
- **Two full-height panels side by side** (stacked on mobile)
- Left panel: Particuliers — diverse photo bg, "Vous êtes un nouvel arrivant ?" heading, desc, animated arrow CTA → /individuals
- Right panel: Entreprises — office/team photo bg, "Vous êtes une organisation ?" heading, desc, animated arrow CTA → /business
- Hover: panel photo zooms in + arrow gap increases
- Slim footer strip: "AudreyRH · CRIA · Montréal" + copyright

## Navbar (consulting template style)
- Always white (no transparent phase)
- Logo "AudreyRH." (green + black + orange dot) on left — clicking = home
- Nav links: Particuliers | Entreprises | Subventions | Contact
- Language toggle (FR/EN) + green "Prendre RV" CTA button on right
- No "Accueil" link — logo serves as home

## Email (Live — via Resend)
- Domain `audreyrh.com` verified on Resend; `RESEND_API_KEY` secret set
- `server/resend.ts` — Resend client using `process.env.RESEND_API_KEY`; all emails from `AudreyRH <info@audreyrh.com>`
- **Booking confirmation** — `POST /api/appointments/:id/confirm`:
  - Marks appointment `paymentStatus = 'paid'`; idempotent (skips email if already paid)
  - Client: French branded HTML with date/time/platform details
  - Audrey: internal notification email
  - Triggered by Book.tsx when Stripe redirects to `?success=true&appointmentId=X`
- **Contact form** — `POST /api/contact`:
  - Validates name, email, grantType, projectDescription
  - Audrey: lead notification with all fields
  - Client: bilingual (FR/EN) auto-reply with copper/navy brand styling
  - Connected to Contact.tsx `handleSubmit`
