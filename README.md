<div align="center">

<img src="./public/dastan-emblem.png" alt="Dastan Experiences Emblem" width="140" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(119,90,0,0.2);" />

# DASTAN EXPERIENCES
### *Storytelling • Culture • Luxury*

> **"Every event becomes a story worth remembering."**  
> *India's premier curated cultural soirées, live storytelling gigs, and heritage dining enclave.*

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment%20Gateway-0c2340?style=for-the-badge&logo=razorpay)](https://razorpay.com/)

---

</div>

## 📖 Table of Contents
- [✨ What Makes Dastan Unique?](#-what-makes-dastan-unique)
- [🎭 Complete Persona User Guides](#-complete-persona-user-guides)
  - [1. Customer / Guest Member Guide](#1-customer--guest-member-guide)
  - [2. Vendor / Event Host Guide](#2-vendor--event-host-guide)
  - [3. Admin / Platform Governance Guide](#3-admin--platform-governance-guide)
- [🌆 All-India 150+ Cities Coverage](#-all-india-150-cities-coverage)
- [💳 Razorpay Payment & Route Settlement Architecture](#-razorpay-payment--route-settlement-architecture)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [🚀 Quickstart & Local Setup](#-quickstart--local-setup)
- [🌐 Step-by-Step Deployment Guide](#-step-by-step-deployment-guide)
- [🔐 Environment Variables Reference](#-environment-variables-reference)

---

## ✨ What Makes Dastan Unique?

Unlike conventional mass-ticketing engines, **Dastan Experiences** is built specifically for intimate, story-driven cultural gatherings:

1. **🏛️ Heritage & Cultural Curation**: Curated live jazz collectives, sufi poetry evenings, culinary masterclasses, and rooftop heritage experiences.
2. **🏙️ All-India 150+ Cities Search**: Real-time searchable city selector with state groupings and top cultural hub pills (Mumbai, Delhi-NCR, Bengaluru, Jaipur, Varanasi, Kochi, Goa, Indore, Kolkata, etc.).
3. **👥 Privacy-First Social Discovery Tables**: Opt-in feature that lets solo attendees and enthusiasts connect with tablemates attending the exact same session without ever exposing personal phone numbers or email addresses.
4. **🎟️ Real-Time Tier Capacity Guard**: Anti-overselling locking that protects ticket tiers (e.g., *Patron Reserved, Royal Balcony, Storyteller Front Row*) and automatically releases capacity upon cancellation.
5. **📲 Scannable QR Boarding Passes**: Digital tickets with cryptographic verification, attendee counts, and gate scanner validation.
6. **⚖️ Automated Monetization & Razorpay Route**: Dynamic 10% platform commission, ₹29 statutory convenience fee, 18% GST calculation, and split settlements for hosts.

---

## 🎭 Complete Persona User Guides

Dastan Experiences features three dedicated, role-specific interfaces:

```
┌────────────────────────────────────────────────────────┐
│                   DASTAN EXPERIENCES                   │
├─────────────────┬──────────────────┬───────────────────┤
│  GUEST MEMBER   │    EVENT HOST    │  PLATFORM ADMIN   │
│   (Customer)    │     (Vendor)     │   (Super Admin)   │
│   /customer     │     /vendor      │      /admin       │
└─────────────────┴──────────────────┴───────────────────┘
```

---

### 1. Customer / Guest Member Guide

> **Persona Demo Login:** `rohan.sharma@example.com` | Password: `Demo123!`

```
Browse City Events ──► Pick Ticket Tier ──► Razorpay Checkout ──► Scannable QR Pass ──► Social Table
```

#### How to use as a Customer:
1. **Choose Your City**: Use the city picker in the navigation bar or login page to choose from 150+ Indian cities or select *"All Cities (Pan-India)"*.
2. **Explore Cultural Listings**:
   - Navigate to [`/events`](http://localhost:3000/events) for curated gigs, heritage walks, and sufi nights.
   - Navigate to [`/dining`](http://localhost:3000/dining) for chef's tables, rooftop supper clubs, and heritage dining deals.
3. **Select Ticket Tier**: Inspect remaining capacity indicators (e.g. *Only 4 tickets left for Royal Front Row*). Select quantity and click **Book Tickets**.
4. **Checkout & Discounts**: Enter any active promo code (e.g. `WELCOME100`) to receive instant price deductions with transparent breakdown of GST and convenience fees.
5. **Receive Boarding Pass**: Upon payment confirmation, access your digital scannable QR Boarding Pass under [`/customer`](http://localhost:3000/customer).
6. **Join the Social Table**: In your Profile settings, toggle **Social Discovery** to connect with fellow cultural enthusiasts attending your session.

---

### 2. Vendor / Event Host Guide

> **Persona Demo Login:** `ananya@indigoexperiences.in` | Password: `Demo123!`

```
Submit KYC ──► Create Listing & Tiers ──► Gate QR Scanner ──► View Sales & Payouts
```

#### How to use as a Vendor:
1. **Vendor Dashboard**: Access [`/vendor`](http://localhost:3000/vendor) to monitor total ticket sales, attendees checked in, and net payout balances.
2. **Publish New Experiences**:
   - Go to [`/vendor/events/new`](http://localhost:3000/vendor/events/new) or [`/vendor/dining/new`](http://localhost:3000/vendor/dining/new).
   - Define event title, date, venue, city, and story summary.
   - Configure **Ticket Tiers** with individual prices and strict capacity limits.
3. **Submit KYC for Settlements**:
   - Navigate to [`/vendor/kyc`](http://localhost:3000/vendor/kyc).
   - Enter your Business Name, GSTIN, PAN, and Bank Account details for direct payouts.
4. **Gate Entry QR Scanner**:
   - On the day of your event, open [`/vendor/scanner`](http://localhost:3000/vendor/scanner) on any mobile or tablet browser.
   - Point the camera at guests' QR boarding passes to approve check-ins in real time with timestamp logging.

---

### 3. Admin / Platform Governance Guide

> **Persona Demo Login:** `admin@dastan.in` | Password: `AdminDastan!`

```
Audit Platform GMV ──► Moderate Listings ──► Verify Vendor KYC ──► Release Payouts
```

#### How to use as an Admin:
1. **Command Center**: Open [`/admin`](http://localhost:3000/admin) to track platform GMV, 10% commission revenues, convenience fee earnings, and active MRR.
2. **Listing Moderation**:
   - Visit [`/admin/events`](http://localhost:3000/admin/events).
   - Review pending submissions from hosts and click **"Approve Listing"** to publish them live to the nation.
3. **Vendor KYC Verification**:
   - Visit [`/admin/vendors`](http://localhost:3000/admin/vendors).
   - Audit host legal documents, PAN/GSTIN, and approve verified badges.
4. **Dynamic Commission & Fee Tuning**:
   - In [`/admin`](http://localhost:3000/admin), adjust platform commission percentage (e.g. 10%) or customer convenience fee (e.g. ₹29) on the fly without redeploying code.
5. **Instant Refunds & Inventory Recovery**:
   - In [`/admin/refunds`](http://localhost:3000/admin/refunds), process refunds on customer request. The system immediately credits inventory back to the event tier.
6. **Promo Campaigns**:
   - Visit [`/admin/promos`](http://localhost:3000/admin/promos) to launch flat ₹ or percentage % discount campaigns with minimum order caps.

---

## 🌆 All-India 150+ Cities Coverage

Dastan Experiences features full national coverage across all 28 states and Union Territories:

| Region | Featured Cultural & Enclave Cities |
| :--- | :--- |
| **Metros & Tier 1** | Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad |
| **Heritage & Culture** | Jaipur, Udaipur, Jodhpur, Varanasi, Agra, Prayagraj, Lucknow, Ayodhya |
| **Coast & Leisure** | Goa (Panaji, Margao, Calangute), Kochi, Pondicherry, Visakhapatnam, Mangaluru |
| **Central & Western** | Indore, Bhopal, Gwalior, Surat, Vadodara, Rajkot, Nagpur, Nashik |
| **North & Hills** | Chandigarh, Amritsar, Ludhiana, Dehradun, Haridwar, Rishikesh, Shimla, Srinagar |
| **East & Northeast** | Patna, Gaya, Bhubaneswar, Cuttack, Ranchi, Jamshedpur, Guwahati, Shillong |

Users can instantly type to search any city, pick top hubs via quick chips, or select **All India (Pan-India)**.

---

## 💳 Razorpay Payment & Route Settlement Architecture

```
[Customer Browser]
       │
       ▼
[POST /api/razorpay/create-order] ──► Locks Ticket Tier Inventory
       │
       ▼
[Razorpay Checkout Modal (UPI/Card/Netbanking)]
       │
       ▼
[POST /api/razorpay/verify-payment] ──► HMAC-SHA256 Signature Verification
       │
       ▼
[Webhook /api/razorpay/webhook] ──► Confirmed Status + QR Pass + Email Ticket
       │
       ▼
[Razorpay Route Settlement] ──► Net host payout (minus 10% platform commission)
```

---

## 🛠️ Tech Stack & Architecture

- **Frontend & Fullstack Framework**: [Next.js 16](https://nextjs.org/) (Turbopack, React 19, Server & Client Components)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom luxury glassmorphism tokens
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with Row-Level Security policies)
- **Payment Processing**: [Razorpay](https://razorpay.com/) Node SDK & Razorpay Route
- **QR Generation & Verification**: `qrcode` library with canvas rendering
- **Icons**: [Lucide React](https://lucide.dev/)
- **End-to-End Testing**: [Playwright](https://playwright.dev/)

---

## 🚀 Quickstart & Local Setup

### 1. Clone the repository:
```bash
git clone https://github.com/kxbir-git/Dastan-Experiences.git
cd Dastan-Experiences
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Setup environment variables:
```bash
cp .env.example .env.local
```

### 4. Run development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🌐 Step-by-Step Deployment Guide

### A. Database (Supabase)
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and execute [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql).
3. Optionally execute [`supabase/migrations/002_seed_data.sql`](./supabase/migrations/002_seed_data.sql).
4. Copy your **Project URL**, **Anon Key**, and **Service Role Key**.

### B. Vercel Cloud (Frontend + API Routes)
1. Go to [vercel.com](https://vercel.com) and import `https://github.com/kxbir-git/Dastan-Experiences.git`.
2. Add the environment variables from your `.env.local`.
3. Click **Deploy**. Your app will be live with free global CDN and HTTPS in under 2 minutes.

### C. Razorpay Webhook
1. In Razorpay Dashboard, set Webhook URL to `https://<YOUR-VERCEL-DOMAIN>/api/razorpay/webhook`.
2. Select `payment.captured`, `payment.failed`, and `refund.processed`.

---

## 🔐 Environment Variables Reference

```env
# Supabase PostgreSQL & Auth
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Razorpay Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Canonical App URL
NEXT_PUBLIC_APP_URL=https://dastanexperiences.com
```

---

<div align="center">
  <p>Crafted with pride for cultural storytelling across India 🇮🇳</p>
  <p>© 2026 Dastan Experiences Technologies. All rights reserved.</p>
</div>
