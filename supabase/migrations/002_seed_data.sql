-- Migration: 002_seed_data.sql
-- Seed Data for Dastan Experiences (Storytelling • Culture • Luxury)

-- Ensure column adaptors and relaxing strict constraints for seeding
ALTER TABLE events ADD COLUMN IF NOT EXISTS category_label TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS starting_price NUMERIC(10,2) DEFAULT 0;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS discount_pct INTEGER DEFAULT 0;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS average_cost_for_two NUMERIC(10,2) DEFAULT 1000;
ALTER TABLE restaurants ALTER COLUMN avg_cost_for_two DROP NOT NULL;
ALTER TABLE restaurants ALTER COLUMN avg_cost_for_two SET DEFAULT 2000;
ALTER TABLE restaurants ALTER COLUMN description DROP NOT NULL;
ALTER TABLE restaurants ALTER COLUMN images DROP NOT NULL;
ALTER TABLE restaurants ALTER COLUMN images SET DEFAULT '{}';
ALTER TABLE restaurant_offers ALTER COLUMN description DROP NOT NULL;
ALTER TABLE restaurant_offers ALTER COLUMN valid_from DROP NOT NULL;
ALTER TABLE restaurant_offers ALTER COLUMN valid_to DROP NOT NULL;

-- 1. Seed Admin Settings
INSERT INTO admin_settings (key, value, updated_at)
VALUES
    ('platform_commission_pct', '10'::jsonb, NOW()),
    ('convenience_fee_fixed', '29'::jsonb, NOW()),
    ('gst_pct', '18'::jsonb, NOW()),
    ('supported_cities', '["Mumbai", "Delhi-NCR", "Bengaluru", "Pune", "Hyderabad", "Goa", "Kolkata", "Jaipur", "Lucknow"]'::jsonb, NOW())
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
        'Lucknow',
        'Storytelling enthusiast, vinyl collector, and craft cocktail aficionado exploring luxury dining in Lucknow.',
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
        'Lucknow',
        'Curating intimate rooftop jazz soirees, Persian poetry storytelling, and cultural experiences in Lucknow.',
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
        'Lucknow',
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
        'Indigo Experiences Hospitality',
        'event_organizer',
        'Lucknow',
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
        'The Awadh Rooftop Jazz & Shaam-e-Dastan Soiree',
        'awadh-rooftop-jazz-shaam-e-dastan-soiree',
        'live_music',
        'LIVE MUSIC & STORYTELLING',
        'An enchanting sunset jazz evening with Nawabi storytelling, five-piece brass ensembles, curated artisanal mocktails & kebabs, and an intimate royal ambiance in Lucknow.',
        'Lucknow',
        'The Heritage Sky Terrace, Hazratganj',
        'Floor 6, Royal Enclave, MG Road, Hazratganj, Lucknow, UP 226001',
        'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
        NOW() + INTERVAL '5 days',
        NOW() + INTERVAL '5 days 4 hours',
        'published',
        TRUE,
        1499.00,
        'Entry valid with Government Photo ID. Smart casual dress code required.'
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
        ARRAY['Sunset Rooftop Access', '1 Artisanal Beverage', 'Gourmet Tapas Platter', 'Dastan Community Table Access']
    ),
    (
        'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
        'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
        'VIP Storyteller Experience',
        2499.00,
        20,
        8,
        ARRAY['Stagefront Priority Seating', 'Free-Flow Curated Beverages', 'Private Sommelier Pairing', 'Exclusive Artist Meet & Greet']
    )
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Luxury Restaurant Venue
INSERT INTO restaurants (
    id, vendor_id, name, slug, description, cuisine_types, city, area, address,
    banner_url, images, rating, review_count, discount_pct, avg_cost_for_two,
    average_cost_for_two, status, is_featured
)
VALUES
    (
        '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
        'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
        'Spice Vault & Speakeasy',
        'spice-vault-speakeasy',
        'An intimate heritage dining enclave pairing royal Awadhi kebabs, artisanal botanical infusions, and secret storyteller tables.',
        ARRAY['Modern Indian', 'Craft Beverages', 'Awadhi & Kebabs'],
        'Lucknow',
        'Hazratganj Heritage Lane',
        'Mahatma Gandhi Marg, Hazratganj, Lucknow, UP 226001',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'],
        4.8,
        342,
        25,
        2400,
        2400.00,
        'published',
        TRUE
    )
ON CONFLICT (slug) DO NOTHING;

-- 7. Seed Restaurant Offer Slot
INSERT INTO restaurant_offers (
    id, restaurant_id, title, discount_pct, description, valid_from, valid_to, cover_charge, available_days, is_active
)
VALUES
    (
        '20eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
        '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
        '25% Off Food & Beverages + Dastan Community Table',
        25,
        'Exclusive 25% discount across all culinary orders plus reserved seating at the Dastan Storyteller Table.',
        '19:00'::TIME,
        '23:30'::TIME,
        150.00,
        ARRAY['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        TRUE
    )
ON CONFLICT (id) DO NOTHING;
