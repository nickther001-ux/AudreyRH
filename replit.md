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

## Recent Changes
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
