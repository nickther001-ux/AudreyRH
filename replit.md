# Audrey Mondesir - Career Consultation Website

## Overview
A professional consultation website for Audrey Mondesir, CRIA (Certified Industrial Relations Advisor), providing career strategy guidance for newcomers to Quebec. Features booking system with Stripe payment integration ($50 USD per consultation).

## Project Structure
- `client/` - React frontend with Vite
- `server/` - Express backend
- `shared/` - Shared types and schemas
- `drizzle.config.ts` - Database configuration

## Key Features
- Professional landing page with strategic career orientation focus
- Hero section: "Ne recommencez pas à zéro. Intégrez le marché intelligemment"
- "Orientation Stratégique" section with 3 key points (Audit, Ciblage, Optimisation)
- "Outils Opérationnels" section (CV, LinkedIn, Entrevues)
- Testimonials section with client success stories
- Booking system with platform selection (Zoom/Google Meet)
- Stripe payment integration
- Admin page for managing availability (/admin)
- French language throughout

## Navigation
- Accueil (Home)
- Méthode & Services (scroll to services section)
- À Propos (scroll to expertise section)
- Témoignages (scroll to testimonials)
- CTA: "Bilan Stratégique Gratuit" (links to booking)

## Database Schema
- `appointments` - Stores booking information with payment status
- `availability_slots` - Stores Audrey's available time blocks

## Routes
- `/` - Home page
- `/book` - Booking page with available time slots
- `/admin` - Admin page for managing availability

## User Preferences
- Currency: USD ($50)
- Language: French
- Platform options: Zoom or Google Meet

## Recent Changes
- 2026-01-08: Restructured homepage with strategic orientation focus
- 2026-01-08: Updated navigation with new menu items and CTA "Bilan Stratégique Gratuit"
- 2026-01-08: Added testimonials section with 3 sample success stories
- 2026-01-08: Service cards now link directly to booking page
- 2026-01-06: Added platform selection (Zoom/Google Meet) to booking form
- 2026-01-06: Created availability management system (admin page at /admin)
- 2026-01-06: Updated booking form to show only available time slots

## Future Enhancements
- Email confirmation: User dismissed Resend integration. To add email functionality later:
  - Option 1: Set up Resend integration through Replit
  - Option 2: User can provide SMTP credentials or other email service API key to store as secrets
  - Email should send welcome/confirmation message after successful payment
