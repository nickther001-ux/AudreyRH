# Audrey Mondesir - Career Consultation Website

## Overview
A professional consultation website for Audrey Mondesir, CRIA (Certified Industrial Relations Advisor), providing career strategy guidance for newcomers to Quebec. Features booking system with Stripe payment integration ($50 USD per consultation).

## Project Structure
- `client/` - React frontend with Vite
- `server/` - Express backend
- `shared/` - Shared types and schemas
- `drizzle.config.ts` - Database configuration

## Key Features
- Professional landing page matching gorh.co design
- Service cards with detailed information dialogs
- Booking system with platform selection (Zoom/Google Meet)
- Stripe payment integration
- Admin page for managing availability (/admin)
- French language throughout

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
- 2026-01-08: Restructured site to multi-page layout (inspired by gorh.co)
- 2026-01-08: Created dedicated /services and /about pages
- 2026-01-08: Added dropdown menu in Navbar with all service categories
- 2026-01-08: Simplified Home page as landing page with links to other pages
- 2026-01-06: Added platform selection (Zoom/Google Meet) to booking form
- 2026-01-06: Created availability management system (admin page at /admin)
- 2026-01-06: Updated booking form to show only available time slots

## Future Enhancements
- Email confirmation: User dismissed Resend integration. To add email functionality later:
  - Option 1: Set up Resend integration through Replit
  - Option 2: User can provide SMTP credentials or other email service API key to store as secrets
  - Email should send welcome/confirmation message after successful payment
