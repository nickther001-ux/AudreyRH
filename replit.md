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
- `/` - Home page
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
- Navy/Sage/Copper color palette
- Montreal cityscape background in hero sections
- Dark overlay for text readability on images
- Sticky sidebar for consultation details on booking page

## Recent Changes
- 2026-01-11: Redesigned booking page with hero banner, sticky sidebar, and numbered step sections
- 2026-01-11: Added bilingual Terms & Conditions page (/terms)
- 2026-01-11: Fixed duplicate translation keys in i18n.tsx
- 2026-01-11: Added comprehensive bilingual support throughout application

## Future Enhancements
- Email confirmation: User dismissed Resend integration. To add email functionality later:
  - Option 1: Set up Resend integration through Replit
  - Option 2: User can provide SMTP credentials or other email service API key to store as secrets
  - Email should send welcome/confirmation message after successful payment
