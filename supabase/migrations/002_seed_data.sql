-- Migration: 002_seed_data.sql
-- Seed Data for Dastan Experiences (Storytelling • Culture • Luxury)

-- Ensure any optional/extended columns exist smoothly
ALTER TABLE events ADD COLUMN IF NOT EXISTS category_label TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS starting_price NUMERIC(10,2) DEFAULT 0;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS discount_pct INTEGER DEFAULT 0;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS average_cost_for_two NUMERIC(10,2) DEFAULT 1000;
ALTER TABLE restaurants ALTER COLUMN description DROP NOT NULL;
ALTER TABLE restaurants ALTER COLUMN images DROP NOT NULL;
ALTER TABLE restaurant_offers ALTER COLUMN description DROP NOT NULL;
ALTER TABLE restaurant_offers ALTER COLUMN valid_from DROP NOT NULL;
ALTER TABLE restaurant_offers ALTER COLUMN valid_to DROP NOT NULL;

-- 1. Seed Admin Settings
INSERT INTO admin_settings (key, value, updated_at)
VALUES
    ('platform_commission_pct', '10'::jsonb, NOW()),
    ('convenience_fee_fixed', '29'::jsonb, NOW()),
    ('gst_pct', '18'::jsonb, NOW()),
    ('supported_cities', '["Mumbai", "Delhi-NCR", "Bengaluru", "Pune", "Hyderabad", "Goa", "Kolkata", "Jaipur"]'::jsonb, NOW())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- 2. Seed Demo Profiles
INSERT INTO profiles (id, role, full_name, display_name, email, phone, city, bio, interests, is_social_opted_in)
VALUES
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'customer',
        'Rohan Sharma',
        'Rohan',
        'rohan.sharma@example.com',
        '+91 98201 98201',
        'Mumbai',
        'Storytelling enthusiast, vinyl collector, and craft cocktail aficionado exploring luxury dining.',
        ARRAY['Storytelling', 'Culture & Arts', 'Jazz & Blues', 'Luxury Dining', 'Culinary Fests'],
        TRUE
    ),
    (
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        'vendor',
        'Ananya Sen',
        'Ananya (Indigo Experiences)',
        'ananya@indigoexperiences.in',
        '+91 98450 44321',
        'Mumbai',
        'Curating intimate rooftop jazz soirees, Persian poetry storytelling, and cultural experiences.',
        ARRAY['Cultural Curation', 'Heritage Dining', 'Live Jazz'],
        FALSE
    ),
    (
        'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
        'admin',
        'Dastan Platform Admin',
        'Super Admin',
        'admin@dastan.in',
        '+91 98200 12345',
        'Mumbai',
        'Dastan Experiences platform governance, listings moderation, and financial settlements.',
        ARRAY['Governance', 'Culture & Arts', 'Settlements'],
        FALSE
    )
ON CONFLICT (email) DO NOTHING;

-- 3. Seed Vendors
INSERT INTO vendors (id, user_id, business_name, business_type, city, gstin, pan, bank_account_number, bank_ifsc, bank_beneficiary_name)
VALUES
    (
        'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        'Indigo Experiences Mumbai',
        'event_organizer',
        'Mumbai',
        '27AABCP9482M1Z4',
        'AABCP9482M',
        '987654321001',
        'HDFC0000123',
        'Indigo Experiences Hospitality LLP'
    )
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Live Experience (Event)
INSERT INTO events (
    id, vendor_id, title, slug, category, category_label, description, city, venue_name, venue_address,
    banner_url, start_time, end_time, status, is_featured, starting_price, terms_conditions
)
VALUES
    (
        'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
        'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
        'The Bandra Rooftop Jazz & Wine Soiree',
        'bandra-rooftop-jazz-wine-soiree',
        'live_music',
        'LIVE MUSIC & STORYTELLING',
        'An enchanting sunset jazz evening overlooking the Arabian Sea, featuring five-piece brass ensembles, artisanal cheese boards, curated natural wines, and intimate storytelling.',
        'Mumbai',
        'The Terrace Lounge, Bandra West',
        'Floor 14, Skyview Tower, Carter Road, Bandra West, Mumbai, MH 400050',
        'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
        NOW() + INTERVAL '5 days',
        NOW() + INTERVAL '5 days 4 hours',
        'published',
        TRUE,
        1499.00,
        'Entry valid with Government Photo ID. Age 21+ only. Smart casual dress code required.'
    )
ON CONFLICT (slug) DO NOTHING;

-- 5. Seed Ticket Tiers
INSERT INTO ticket_tiers (id, event_id, tier_name, price, total_capacity, sold_count, perks)
VALUES
    (
        'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
        'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
        'Early Bird Soiree Pass',
        1499.00,
        40,
        18,
        ARRAY['Sunset Rooftop Access', '1 Artisanal Wine Glass', 'Gourmet Tapas Platter', 'Dastan Community Table Access']
    ),
    (
        'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
        'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
        'VIP Storyteller Experience',
        2499.00,
        20,
        8,
        ARRAY['Stagefront Priority Seating', 'Free-Flow Curated Wines', 'Private Sommelier Pairing', 'Exclusive Artist Meet & Greet']
    )
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Luxury Restaurant Venue
INSERT INTO restaurants (
    id, vendor_id, name, slug, cuisine_types, city, area, address, banner_url,
    rating, review_count, discount_pct, average_cost_for_two, status, is_featured
)
VALUES
    (
        '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
        'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
        'Spice Vault & Speakeasy',
        'spice-vault-speakeasy',
        ARRAY['Modern Indian', 'Craft Cocktails', 'Kebabs & Grills'],
        'Mumbai',
        'Lower Parel',
        'Mills Compound, Senapati Bapat Marg, Lower Parel, Mumbai, MH 400013',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        4.8,
        342,
        25,
        2400.00,
        'published',
        TRUE
    )
ON CONFLICT (slug) DO NOTHING;

-- 7. Seed Restaurant Offer Slot
INSERT INTO restaurant_offers (id, restaurant_id, title, discount_pct, cover_charge, available_days, is_active)
VALUES
    (
        '20eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
        '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
        '25% Off Food & Beverages + Dastan Community Table',
        25,
        150.00,
        ARRAY['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        TRUE
    )
ON CONFLICT (id) DO NOTHING;
