---
name: Royal Midnight Heritage
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#bdc2ff'
  on-secondary: '#131e8c'
  secondary-container: '#2f3aa3'
  on-secondary-container: '#a8afff'
  tertiary: '#58e7aa'
  on-tertiary: '#003824'
  tertiary-container: '#33ca90'
  on-tertiary-container: '#005035'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e0e0ff'
  secondary-fixed-dim: '#bdc2ff'
  on-secondary-fixed: '#000767'
  on-secondary-fixed-variant: '#2f3aa3'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: 0em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
  title-lg:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.01em
  title-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Outfit
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Outfit
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.04em
  label-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-pill:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system marries aristocratic heritage with contemporary digital intimacy. It is built for a premier luxury cultural experiences, bespoke dining, and ticketing marketplace that bridges centuries-old hospitality traditions with modern digital craft. 

The aesthetic style is **Royal Heritage Meets Modern Midnight Glassmorphism**:
- **Atmosphere:** Deep, moody, nocturnal, and regal. Deep imperial obsidian grounds the canvas, allowing translucent smoked-slate glass panels to float weightlessly.
- **Visual Tension:** Classical, editorial high-contrast serif typography juxtaposed against razor-sharp modern geometric sans and micro-monospaced ticketing telemetry.
- **Accents:** Restrained royal champagne gold foiling and mystical Persian indigo halos, balanced with subtle amber warmth rather than harsh synthetic glows.
- **Emotional Response:** Curated, exclusive, storied, and prestigious—evoking the mystery of an invite-only midnight salon and the ceremonial grace of historic courts.

## Colors

The palette embraces strict nocturnal luxury, using tinted translucency and warm metallic lusters instead of flat fills.

### Color Tokens & Rules
- **Base Canvas (`#0B0F19` - Deep Imperial Obsidian):** The non-negotiable floor for the UI. Never use pure `#000000`.
- **Primary Glass Surface (`rgba(18, 24, 38, 0.70)` - Midnight Velvet Slate):** Smoked translucent container backed by `backdrop-filter: blur(20px)` and framed with `rgba(212, 175, 55, 0.15)`.
- **Primary Accent (`#D4AF37` - Royal Champagne Gold):** Reserved for prestige status, active navigation, luxury badges, and primary interactive elements. Can be rendered as a directional metallic sheen via `linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)`.
- **Secondary Accent (`#818CF8` - Persian Indigo / Mystical Lavender):** Used for ambient focal glows, cultural storytelling accents, tags, and ethereal secondary interactions.
- **Functional Accents:**
  - **Success / Verified (`#10B981` - Emerald Green):** Authenticated experiences, verified hosts, confirmed bookings.
  - **Alert / Destructive (`#F43F5E` - Ruby Rose):** Limited seat warnings, cancellation triggers, critical alerts.
- **Typography & Content Hierarchy:**
  - **Headlines (`#FFFFFF`):** Pure white or clipped gold foil gradient for hero statements.
  - **Body / Subtext (`#94A3B8` - Slate Muted):** High legibility without overpowering the gold accents.
  - **Captions / High-Priority Micro-copy (`#FCD34D` - Warm Amber):** Curated metadata, dates, and VIP status indicators.

## Typography

The typography implements a strict three-tier role system:
1. **The Narrator (Playfair Display):** Conveys heritage, time-honored luxury, and cultural depth. Used exclusively for experience titles, thematic headers, and section statements.
2. **The Modern Host (Outfit):** Provides crisp modern clarity for navigation, summaries, descriptive reviews, body copy, and UI controls.
3. **The Ledger (JetBrains Mono):** Injects precise utilitarian craft into ticketing, INR (`₹`) currency pricing, time slots, confirmation tokens, and serial keys.

Editorial headings (`display-hero`) can utilize a text gradient clipped to the gold metallic token when displayed against midnight surfaces.

## Layout & Spacing

The layout is built upon an adaptive 12-column fluid grid, moving to 8 columns on tablet and 4 columns on mobile. 
- **Desktop (1280px+):** Outer margin of `3rem` (`48px`) with `1.5rem` (`24px`) gutters. Section compositions embrace deliberate asymmetry: hero booking manifests and visual vignettes sit alongside wide-column editorial narrative strips.
- **Tablet (768px - 1279px):** Outer margin scales down to `2rem` (`32px`) with `1.25rem` (`20px`) gutters. Multi-column cards collapse into alternating 2-column modules.
- **Mobile (< 768px):** Outer margin collapses to `1.25rem` (`20px`) with `1rem` (`16px`) gutters. Horizontal snap-carousels handle high-density ticketing feeds, preserving canvas headroom.
- **Vertical Rhythm:** Components rely strictly on the `space-*` scale to preserve rhythm: micro metadata groups use `space-xs` and `space-sm`, card interior padding locks to `space-lg`, and major interface modules decouple across `space-xl`.

## Elevation & Depth

Visual hierarchy uses physical glass layering coupled with golden ambient halos rather than heavy dropshadows:

1. **Canvas Layer (Base):** Deep Imperial Obsidian (`#0B0F19`), completely matte with an optional 10% opacity, radial radial-gradient of Persian Indigo (`#818CF8`) placed deep in the background for atmospheric vignette.
2. **Surface Layer (Cards, Modules):** Background set to `rgba(18, 24, 38, 0.70)` with `backdrop-filter: blur(20px) saturate(180%)`. Outlined with a fine 1px border: `rgba(212, 175, 55, 0.15)`.
3. **Floating Layer (Modals, Overlays, Dropdowns):** Background set to `rgba(24, 32, 50, 0.85)` with `backdrop-filter: blur(28px)`. Border stepped up to `rgba(212, 175, 55, 0.3)`. Drop shadow: `0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.08)`.
4. **Hover & Interactive State:** When cards or interactive panels are hovered, border transitions to `rgba(212, 175, 55, 0.45)`, accompanied by a diffuse ambient glow: `box-shadow: 0 0 25px rgba(245, 158, 11, 0.12)`.

## Shapes

The design system employs a **Rounded (`2`)** structural grammar:
- Standard structural surfaces, cards, and input fields utilize `0.5rem` (`8px`) border radii, maintaining architectural poise.
- Larger feature containers, experiential modal dialogs, and drawer sheets shift to `rounded-lg` (`1rem` / `16px`).
- Filter badges, micro tags, status indicators, and pill action triggers utilize continuous pill borders (`9999px`) to create high-tactility interactive focal points contrasting against angular media crops.

## Components

### Buttons
- **Primary Luxury Action:** Rich metallic gradient fill (`linear-gradient(135deg, #F59E0B, #D97706, #B45309)`), text in `#0B0F19` (bold Outfit sans), `rounded-md` (8px). On hover: expands a subtle amber rim glow (`0 0 16px rgba(245, 158, 11, 0.4)`).
- **Secondary Midnight Glass:** Smoked translucent surface (`rgba(255, 255, 255, 0.05)`), border `1px solid rgba(212, 175, 55, 0.3)`, text in `#FFFFFF`. On hover: surface tints to `rgba(212, 175, 55, 0.1)` and border lights up to `#D4AF37`.
- **Tertiary / Ghost:** No background; gold text (`#D4AF37`) with underline on hover, accompanied by a micro chevron.

### Cards & Experience Tiles
- **Experience Card:** Glassmorphic background (`#121826` at 70% opacity, 20px blur), wrapped in a 1px border `rgba(212, 175, 55, 0.15)`. Top section features high-resolution editorial photography with a bottom obsidian gradient fade. Price displayed in `JetBrains Mono` with an amber highlight (`#FCD34D`). 
- **VIP Access Pass / Ticket:** Perforated divider visual, barcode/QR zone in mono, embossed metallic badge labeled "ROYAL PATRON" or "VERIFIED ACCESS" with emerald green or gold foil treatment.

### Chips & Badges
- **Pill Filters:** Pill-shaped (`rounded-full`), semi-translucent slate fill. Active state features a glowing `rgba(212, 175, 55, 0.2)` fill with gold text and a solid 1px `#D4AF37` hairline stroke.
- **Status Badges:** Miniature mono pills (`label-mono-sm`). E.g., "LIMITED TO 12 GUESTS" in Ruby Rose tint (`rgba(244, 63, 94, 0.15)` fill with `#F43F5E` text).

### Form Inputs & Selectors
- **Input Fields:** Dark tinted fields (`rgba(11, 15, 25, 0.6)`) with `1px solid rgba(148, 163, 184, 0.2)`. Placeholder text in muted slate (`#94A3B8`). On focus: border shifts cleanly to `#D4AF37` with an ambient glow of `0 0 8px rgba(212, 175, 55, 0.2)`. Label rendered in Outfit uppercase tracking.
- **Date & Party Size Pickers:** Calendar and counter flyouts float as frosted glass surfaces with gold selection rings and mono number labels.

### Checkboxes & Radios
- Square / circular controls with a 1.5px hairline border of `rgba(212, 175, 55, 0.4)`. Checked state displays a glowing gold background (`#D4AF37`) with obsidian checkmarks.

### Progress Gauges & Curated Availability
- Thin 3px tracking bars with obsidian track backgrounds. Active fill uses the royal gold gradient, pulsing slightly at full capacity to signal scarce luxury access.