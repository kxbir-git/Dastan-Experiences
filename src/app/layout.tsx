import { Suspense } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Dastan Experiences | Every Event Has a Story — Storytelling, Culture & Luxury',
  description:
    'Every event becomes a story worth remembering. Discover curated cultural soirées, luxury dining deals, and immersive live storytelling experiences with opt-in community tables.',
  keywords: [
    'Dastan Experiences',
    'Storytelling Culture Luxury',
    'Every Event Has a Story',
    'Luxury Dining India',
    'Live Events Mumbai',
    'Cultural Evenings Delhi',
    'Community Table Booking',
    'Curated Experiences',
  ],
  authors: [{ name: 'Dastan Experiences Technologies' }],
  openGraph: {
    title: 'Dastan Experiences | Storytelling • Culture • Luxury',
    description:
      'Every event becomes a story worth remembering. Curated live concerts, cultural soirees, and exclusive dining perks with verified community connections.',
    url: 'https://dastanexperiences.com',
    siteName: 'Dastan Experiences',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dastan Experiences | Every Event Has a Story',
    description:
      'Storytelling • Culture • Luxury — Discover curated gigs, exclusive restaurant perks, and opt-in social tables across India.',
  },
  icons: {
    icon: [
      { url: '/dastan-emblem.png', type: 'image/png' },
      { url: '/favicon.png' },
    ],
    shortcut: '/dastan-emblem.png',
    apple: '/dastan-emblem.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        {/* Google Fonts: Playfair Display, Manrope, JetBrains Mono, and Material Symbols */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Manrope:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {/* Load Razorpay Checkout Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#18181B] font-body-md antialiased selection:bg-[#FFDF9A] selection:text-[#251A00]">
        <Suspense fallback={<div className="h-20 border-b border-[#E6DFD5] bg-white" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
