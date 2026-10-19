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
Agar aap Dastan Experiences platform par apna Sufi & Cultural Fest (Sufi music, singing, artisan & food stalls, cultural theme) organize karke tickets bechna chahte hain, toh yahan iska complete Step-by-Step Guide hai:

🏛️ Step 1: Vendor Portal & KYC Setup Karein
Tickets sale karne aur paise seedhe apne bank account mein lene ke liye sabse pehle vendor profile set karni hoti hai:

Left navigation menu ya dashboard se 

Vendor Dashboard
 (/vendor) par jayein.
KYC & Bank Details (/vendor/kyc) section open karein:
Organizer / Business Name: Jaise "Sufi Heritage Collective" ya aapki event company ka naam.
Bank Details: Bank Account Number, IFSC code, aur Beneficiary Name (jahan Razorpay se ticket sales ke payouts transfer honge).
PAN / GSTIN: Tax aur legal compliance ke liye.
📝 Step 2: Create New Event Page Par Jayein
Vendor sidebar mein "Live Events" (/vendor/events) par click karein.
Top right corner par + Create New Event button par click karein ya direct 

/vendor/events/new
 par jayein.
🎨 Step 3: Event Details Bharein (Sufi & Cultural Theme)
Field	Kya Fill Karein (Example)	Tips
Event Title	Shaam-e-Sufi: Awadh Cultural Fest & Musical Mehfil	Catchy aur theme-based naam rakhein
Category	Dropdown se Cultural Experience ya Live Music & Jazz chunein	Ye website par right filter mein dikhayega
City	City select karein (e.g. Lucknow, Delhi-NCR, Jaipur, etc.)	Local crowd attract karne ke liye
Venue Name	The Royal Heritage Lawns / Sky Terrace	Exact landmark venue
Venue Address	Complete physical address with Pincode	Google maps navigation ke liye
Date & Time	Start: Fest date & 05:00 PM
End: Same date & 11:30 PM	Gates open time se le kar wrapping time tak
Banner Image	Sufi lamps, stage aur cultural aesthetic ki high-resolution photo URL	First impression yahi banata hai
Description	Lineup + Stalls ka detail likhein:
• Live Sufi Qawwali & Acoustic Singing performances
• Artisan craft, pottery, attar & cultural flea stalls
• Royal Awadhi food & kulhad chai counters
• Traditional baithak seating & photo booths	Guests ko pura schedule aur attractions pata chal sakein
Age & Terms	Age: Family Friendly (All Ages) ya 16+
Terms: "Photo ID mandatory for entry. Outside food not allowed."	Gate rules clear rakhein
🎟️ Step 4: Multi-Tier Tickets & Capacity Configure Karein
Aapke fest mein alag-alag type ke attendees aayenge, isliye 3 Tiers add karein:

Tier 1 (General Pass - Stalls & Ground Entry):

Name: General Fest Pass (Flea & Stalls Access)
Price: ₹499
Total Capacity: 300 (Jitne log grounds par allow hain)
Perks: Stalls access, Open lawn standing zone, 1 Cultural welcome badge
Tier 2 (Sufi Baithak - Seated Music Pass):

Name: Sufi Baithak (Reserved Stage Seating)
Price: ₹1,299
Total Capacity: 150
Perks: Front baithak cushion seating, 1 Kulhad beverage, Free stalls entry
Tier 3 (Royal Dastan VIP Cabana / All-Inclusive):

Name: Royal Dastan VIP Pass
Price: ₹2,499
Total Capacity: 40
Perks: Exclusive VIP cabana lounge, ₹500 food/stall vouchers, Meet & Greet with Sufi artists, Priority valet parking
Auto-Capacity Lock: Dastan platform me real-time inventory lock laga hai — jaise hi 40 VIP tickets bik jayengi, platform automatically use Sold Out dikhayega, taaki overselling na ho.

🚀 Step 5: Submit & Live Karna
Form ke end mein Submit Event for Review par click karein.
Event save hokar Pending Approval mein chala jata hai.
Admin dashboard se approve hote hi ye public website (/events) par live ho jayega aur aapko ek shareable link mil jayegi:
Example: https://dastanexperiences.com/events/shaam-e-sufi-awadh-cultural-fest
Is link ko aap apne Instagram bio, posters, WhatsApp, aur marketing campaigns par promote kar sakte hain.
📱 Step 6: Event Ke Din Gate Entry (QR Scanner)
Event ke din ticket checking ke liye kisi alag hardware ki zaroorat nahi hai:

Apne phone ya tablet me vendor account login karein aur 

QR Scanner
 (/vendor/scanner) open karein.
Jab guest aayega, unke phone me Dastan ka digital ticket aur unique QR code hoga.
Camera se scan karte hi screen par:
🟢 "Checked In: Rohan Sharma (VIP Pass - 2 Guests)" confirm ho jayega.
Agar koi duplicate ya used ticket dikhayega toh system turant 🔴 "Already Checked In" alert de dega.
💰 Step 7: Settlements & Payouts
Har ticket sale par platform commission aur GST automatically calculate hota hai.
Aap Vendor Payouts (/vendor/payouts) tab me real-time dekh sakte hain ki kitne tickets bike aur kitna revenue aapke bank account mein credit hone ke liye schedule hua hai.-


<div align="center">
  <p>Crafted with pride for cultural storytelling across India 🇮🇳</p>
  <p>© 2026 Dastan Experiences Technologies. All rights reserved.</p>
</div>
