# Audrey Mondesir - Career Consultation Website

## Overview
A professional bilingual (French/English) consultation website for Audrey Mondesir, CRIA (Certified Industrial Relations Advisor), providing career strategy guidance for newcomers to Quebec. Features booking system with Stripe payment integration ($50 USD per consultation).

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
- Admin page for managing availability (/admin)
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
- `/contact` - Contact & Grant Application form page

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
- 2026-04-02: Full homepage redesign — pixel-level clone of consulting.framer.media with AudreyRH content
- 2026-01-11: Redesigned booking page with hero banner, sticky sidebar, and numbered step sections
- 2026-01-11: Added bilingual Terms & Conditions page (/terms)
- 2026-01-11: Fixed duplicate translation keys in i18n.tsx
- 2026-01-11: Added comprehensive bilingual support throughout application

## Homepage Layout (consulting.framer.media clone)
Home.tsx (/) sections in order:
1. **Hero** — split layout: text (white bg) left, Audrey's photo right; two CTA buttons
2. **Trust Strip** — infinite CSS marquee of partner organization names (Ordre des CRHA, CRIA, Service Canada, etc.)
3. **Services** — "Nos services" label + heading/subtitle + 3 editorial photo cards + "Need customized?" CTA box
4. **Approach** — large photo left with floating "+95%" stat card, text content right (label + heading + 2 checkmarks + journey photo)
5. **Why Choose Us** — "Pourquoi nous choisir" + 3 linked feature cards (gap-px grid border technique)
6. **Process** — large heading + 4 numbered step cards in 2×2 grid (gap-px border technique)
7. **Stats** — large photo with "85+" / "95%" stats overlay, commitment text + CTA button
8. **Testimonials** — 6 testimonial cards (3-column grid), initial avatars

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
