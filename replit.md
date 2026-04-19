# Audrey Mondesir - Career Consultation Website

## Overview
This project delivers a professional bilingual (French/English) website for Audrey Mondesir, CRIA, focusing on career strategy guidance for newcomers to Quebec. It integrates a robust booking system with Stripe payment, administrative tools, and an AI chat widget to enhance user interaction and streamline operations. The website aims to serve individuals and businesses, offering various consultation services.

## User Preferences
- Currency: USD ($50)
- Languages: French (default) and English
- Platform options: Zoom or Google Meet

## System Architecture
The project utilizes a client-server architecture with a React frontend (Vite) and an Express.js backend. `shared/` contains common types and schemas. Database interactions are managed with Drizzle ORM, with a focus on raw SQL for critical operations to ensure reliability.

**UI/UX Design:**
- **Color Palette:** Inspired by `consulting.framer.media`, featuring a forest green primary (`#239b56`), near-black foreground (`#111`), pure white backgrounds, and an orange brand accent.
- **Visuals:** Montreal cityscape backgrounds with near-black overlays are used in hero sections. Clean white or light gray sections are preferred for a professional consulting aesthetic.
- **Call to Action (CTA):** Solid primary green backgrounds with white text and buttons.
- **Modals:** Near-black headers with green primary accent buttons.
- **Navigation:** A white navbar with a green brand logo, remaining transparent over hero sections and becoming solid white on scroll.
- **Footer:** Near-black background.
- **Homepage:** A full-screen split portal with two distinct panels for "Individuals" and "Businesses," featuring animated CTAs and hover effects.
- **Admin Page:** Features a beach background and a midnight blue palette for managing bookings.

**Technical Implementations:**
- **Bilingual Support:** Full French/English support with a language toggle, handled by `client/src/lib/i18n.tsx`. The `language` preference is stored with appointments and used for localized email templates.
- **Booking System:** A redesigned, step-based booking page with a sticky sidebar. It supports platform selection (Zoom/Google Meet) and integrates with Google Calendar API for event creation, falling back to a static Meet link if necessary.
- **Stripe Integration:** Secure payment processing for consultations.
- **Admin Panel (`/admin`):** Allows Audrey to manage availability slots and approve, reject, or reschedule bookings.
- **AI Chat Widget:** A floating chat bubble (bottom-right, navy/blue gradient) powered by Gemini 2.5 Flash, providing bilingual support and lead capture functionality.
- **Email System:** Utilizes Resend for branded, localized email communications, including booking confirmations, internal notifications, and contact form auto-replies.
- **Database Schema:** Key tables include `appointments` (booking info, payment status, language) and `availability_slots` (Audrey's available time blocks).
- **Features:**
    - Professional landing pages for individuals and businesses.
    - Service cards with detailed information dialogs.
    - Terms & Conditions page (`/terms`).
    - Social media links (TikTok, LinkedIn).
    - Grants & Funding portal (`/grants`).
    - FAQ page (`/faq`) with accordion-style Q&A.
    - Simple contact form (`/contact`) sending emails via `/api/contact-simple`.

## External Dependencies
- **Stripe:** Payment gateway for processing consultation fees.
- **Google Calendar API:** Used for creating Google Meet events and scheduling.
- **Google Meet:** Platform for virtual consultations.
- **Gemini 2.5 Flash:** Powers the AI chat widget for customer interaction.
- **Resend:** Email service for transactional and marketing communications.
- **PostgreSQL:** Primary database for storing application data.