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
- Comprehensive Services/Pricing page with B2C packages (Phase 0-D: $50-$950) and B2B recruitment ($2,500-$3,500)
- Redesigned booking page with hero banner, sticky sidebar, and step-based form
- Booking system with platform selection (Zoom/Google Meet)
- Stripe payment integration ($50 USD Discovery Interview)
- Password-protected Admin page for managing availability
- Strict NO REFUND policy (Phase 0 amount applied as credit to higher packages)
- Terms & Conditions page (/terms)
- Social media links (TikTok, LinkedIn)

## Database Schema
- `appointments` - Stores booking information with payment status
- `availability_slots` - Stores Audrey's available time blocks

## Routes
- `/` - Home page
- `/services` - Services & Pricing page with B2C/B2B offerings
- `/book` - Booking page with available time slots
- `/admin` - Admin page for managing availability (password protected)
- `/terms` - Terms & Conditions page

## User Preferences
- Currency: USD ($50)
- Languages: French (default) and English
- Platform options: Zoom or Google Meet

## Design System
- Navy/Sage/Copper color palette
- Montreal cityscape background in hero sections
- Dark overlay for text readability on images
- Sticky sidebar for consultation details on booking page

## Recent Changes
- 2026-01-19: Added comprehensive Services/Pricing page with B2C (5 packages) and B2B sections
- 2026-01-19: Updated navigation with Services page link
- 2026-01-11: Redesigned booking page with hero banner, sticky sidebar, and numbered step sections
- 2026-01-11: Added bilingual Terms & Conditions page (/terms)
- 2026-01-11: Fixed duplicate translation keys in i18n.tsx
- 2026-01-11: Added comprehensive bilingual support throughout application

## Future Enhancements
- Email confirmation: User dismissed Resend integration. To add email functionality later:
  - Option 1: Set up Resend integration through Replit
  - Option 2: User can provide SMTP credentials or other email service API key to store as secrets
  - Email should send welcome/confirmation message after successful payment
