-- Migration: 000_full_reset.sql
-- Full Database Reset for Dastan Experiences
-- Drops ALL existing tables, types, policies and recreates from scratch.
-- WARNING: This is a destructive operation. All existing data will be lost.

-- ============================================
-- STEP 1: Drop all RLS Policies
-- ============================================
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- ============================================
-- STEP 2: Drop all tables (in dependency order)
-- ============================================
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS admin_settings CASCADE;
DROP TABLE IF EXISTS social_discovery_optins CASCADE;
DROP TABLE IF EXISTS refunds CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS promo_codes CASCADE;
DROP TABLE IF EXISTS ticket_tiers CASCADE;
DROP TABLE IF EXISTS restaurant_offers CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- STEP 3: Drop custom types
-- ============================================
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS listing_status CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;

-- ============================================
-- STEP 4: Re-run full schema creation
-- ============================================
-- (001_initial_schema.sql content follows)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Custom Types
CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin');
CREATE TYPE listing_status AS ENUM ('draft', 'pending_approval', 'published', 'rejected', 'archived');
CREATE TYPE booking_status AS ENUM ('pending_payment', 'confirmed', 'checked_in', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('created', 'authorized', 'captured', 'failed', 'refunded');

-- 1. Profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role DEFAULT 'customer' NOT NULL,
    full_name TEXT NOT NULL,
    display_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    city TEXT DEFAULT 'Mumbai',
    bio TEXT,
    interests TEXT[] DEFAULT '{}',
    is_social_opted_in BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Vendors
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    city TEXT NOT NULL,
    gstin TEXT,
    pan TEXT,
    bank_account_number TEXT,
    bank_ifsc TEXT,
    bank_beneficiary_name TEXT,
    razorpay_account_id TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    commission_override_pct NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Restaurants
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cuisine_types TEXT[] NOT NULL,
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    address TEXT NOT NULL,
    lat NUMERIC(10,7),
    lng NUMERIC(10,7),
    banner_url TEXT,
    images TEXT[] DEFAULT '{}',
    avg_cost_for_two INTEGER DEFAULT 2000,
    average_cost_for_two NUMERIC(10,2) DEFAULT 1000,
    rating NUMERIC(3,2) DEFAULT 4.5,
    review_count INTEGER DEFAULT 0,
    discount_pct INTEGER DEFAULT 0,
    status listing_status DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE,
    social_table_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Restaurant Offers
CREATE TABLE restaurant_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    discount_pct INTEGER NOT NULL,
    description TEXT DEFAULT '',
    available_days TEXT[] NOT NULL,
    valid_from TIME,
    valid_to TIME,
    cover_charge INTEGER DEFAULT 0,
    max_covers_per_slot INTEGER DEFAULT 20,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    category_label TEXT,
    description TEXT NOT NULL,
    city TEXT NOT NULL,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    banner_url TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    starting_price NUMERIC(10,2) DEFAULT 0,
    status listing_status DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE,
    age_restriction TEXT DEFAULT '18+',
    terms_conditions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Ticket Tiers
CREATE TABLE ticket_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    tier_name TEXT NOT NULL,
    price INTEGER NOT NULL,
    total_capacity INTEGER NOT NULL,
    sold_count INTEGER DEFAULT 0 NOT NULL,
    perks TEXT[] DEFAULT '{}',
    sales_start TIMESTAMPTZ,
    sales_end TIMESTAMPTZ,
    CONSTRAINT check_capacity CHECK (sold_count <= total_capacity)
);

-- 7. Promo Codes
CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL,
    discount_value INTEGER NOT NULL,
    min_order_amount INTEGER DEFAULT 0,
    max_discount_amount INTEGER,
    valid_until TIMESTAMPTZ NOT NULL,
    usage_limit INTEGER DEFAULT 100,
    times_used INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 8. Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE RESTRICT NOT NULL,
    booking_type TEXT NOT NULL,
    event_id UUID REFERENCES events(id),
    restaurant_id UUID REFERENCES restaurants(id),
    offer_id UUID REFERENCES restaurant_offers(id),
    tier_id UUID REFERENCES ticket_tiers(id),
    quantity INTEGER DEFAULT 1 NOT NULL,
    booking_date DATE NOT NULL,
    time_slot TEXT,
    base_amount INTEGER NOT NULL,
    discount_amount INTEGER DEFAULT 0 NOT NULL,
    convenience_fee INTEGER NOT NULL,
    gst_amount INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    status booking_status DEFAULT 'pending_payment' NOT NULL,
    qr_code_hash TEXT UNIQUE NOT NULL,
    is_social_opted_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT UNIQUE,
    razorpay_signature TEXT,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR',
    status payment_status DEFAULT 'created' NOT NULL,
    error_message TEXT,
    webhook_received_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Refunds
CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE RESTRICT NOT NULL,
    payment_id UUID REFERENCES payments(id) ON DELETE RESTRICT NOT NULL,
    razorpay_refund_id TEXT UNIQUE,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    initiated_by UUID REFERENCES profiles(id),
    status TEXT DEFAULT 'processed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Social Discovery Table Opt-ins
CREATE TABLE social_discovery_optins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    booking_date DATE NOT NULL,
    time_slot TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, booking_id)
);

-- 12. Admin Settings
CREATE TABLE admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 5: Enable Row Level Security
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_discovery_optins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 6: Create RLS Policies
-- ============================================

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Public listings
CREATE POLICY "Public events viewable" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Public restaurants viewable" ON restaurants FOR SELECT USING (status = 'published');
CREATE POLICY "Public ticket tiers viewable" ON ticket_tiers FOR SELECT USING (true);
CREATE POLICY "Public restaurant offers viewable" ON restaurant_offers FOR SELECT USING (is_active = true);

-- Bookings
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);

-- Service role bypass (for admin API calls)
CREATE POLICY "Service role full access profiles" ON profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access vendors" ON vendors FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access events" ON events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access restaurants" ON restaurants FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access restaurant_offers" ON restaurant_offers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access ticket_tiers" ON ticket_tiers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access bookings" ON bookings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access payments" ON payments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access refunds" ON refunds FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access social_discovery_optins" ON social_discovery_optins FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access admin_settings" ON admin_settings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access audit_logs" ON audit_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access promo_codes" ON promo_codes FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- STEP 7: Seed Fresh Data
-- ============================================

-- 7.1 Admin Settings
INSERT INTO admin_settings (key, value, updated_at)
VALUES
    ('platform_commission_pct', '10'::jsonb, NOW()),
    ('convenience_fee_fixed', '29'::jsonb, NOW()),
    ('gst_pct', '18'::jsonb, NOW()),
    ('supported_cities', '["Mumbai", "Delhi-NCR", "Bengaluru", "Pune", "Hyderabad", "Goa", "Kolkata", "Jaipur", "Lucknow", "Chennai", "Ahmedabad", "Chandigarh", "Kochi", "Bhopal", "Indore"]'::jsonb, NOW());

-- 7.2 Seed Profiles
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
        'Architect & urban explorer. Enthusiast for live music and weekend chef tables.',
        ARRAY['Live Gigs', 'Architecture', 'Craft Beer', 'Standup'],
        TRUE
    ),
    (
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        'vendor',
        'Ananya Mehra',
        'Ananya (Indigo Experiences)',
        'ananya@indigoexperiences.in',
        '+91 98450 44321',
        'Mumbai',
        'Curator of rooftop music & cultural experiences across Mumbai & Goa.',
        ARRAY['Event Management', 'Curated Dinners', 'Live Arts'],
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
        'Platform governance, settlements & trust & safety director.',
        ARRAY['Platform Operations', 'Trust & Safety', 'Settlements'],
        FALSE
    );

-- 7.3 Seed Vendors
INSERT INTO vendors (id, user_id, business_name, business_type, city, gstin, pan, bank_account_number, bank_ifsc, bank_beneficiary_name, razorpay_account_id, is_verified, commission_override_pct)
VALUES
    (
        'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        'Indigo Experiences Mumbai',
        'event_organizer',
        'Mumbai',
        '27AABCI4821E1Z3',
        'AABCI4821E',
        '918239001238',
        'HDFC0000060',
        'Indigo Hospitality Ventures Pvt Ltd',
        'acc_RzpRouteIndigo82',
        TRUE,
        10
    );

-- 7.4 Seed Restaurant
INSERT INTO restaurants (
    id, vendor_id, name, slug, description, cuisine_types, city, area, address,
    banner_url, images, rating, review_count, discount_pct, avg_cost_for_two,
    average_cost_for_two, status, is_featured
)
VALUES
    (
        '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
        'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
        'The Spice Vault & Bar',
        'the-spice-vault-bar-lower-parel',
        'Progressive Indian regional dining pairing lost culinary recipes with modernist mixology. Lively open kitchen, brass-accented communal tables, and zero-proof botanical spirits.',
        ARRAY['Modern Indian', 'Coastal Curries', 'Craft Cocktails'],
        'Mumbai',
        'Lower Parel',
        'Unit 12, Kamala Mills Compound, Senapati Bapat Marg, Lower Parel, Mumbai 400013',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'],
        4.8,
        342,
        25,
        2400,
        2400.00,
        'published',
        TRUE
    );

-- 7.5 Seed Restaurant Offer
INSERT INTO restaurant_offers (
    id, restaurant_id, title, discount_pct, description, valid_from, valid_to, cover_charge, available_days, is_active
)
VALUES
    (
        '20eebc99-9c0b-4ef8-bb6d-6bb9bd380a99',
        '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
        '25% Flat Off Food & Signature Drinks',
        25,
        'Enjoy 25% off the entire a la carte bill for social table and private table bookings.',
        '19:00'::TIME,
        '23:30'::TIME,
        200,
        ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
        TRUE
    );

-- 7.6 Seed a Featured Event
INSERT INTO events (
    id, vendor_id, title, slug, category, category_label, description, city, venue_name, venue_address,
    banner_url, start_time, end_time, status, is_featured, starting_price, terms_conditions
)
VALUES
    (
        'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
        'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
        'The Bandra Rooftop Jazz & Storytelling Soiree',
        'bandra-rooftop-jazz-storytelling-soiree',
        'live_music',
        'LIVE MUSIC & STORYTELLING',
        'An enchanting sunset jazz evening with curated storytelling, five-piece brass ensemble, artisanal cocktails & tapas, and an intimate rooftop ambiance in Mumbai.',
        'Mumbai',
        'The Heritage Sky Terrace, Bandra West',
        'Floor 6, Royal Enclave, Hill Road, Bandra West, Mumbai 400050',
        'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
        NOW() + INTERVAL '7 days',
        NOW() + INTERVAL '7 days 4 hours',
        'published',
        TRUE,
        1499.00,
        'Entry valid with Government Photo ID. Smart casual dress code required.'
    );

-- 7.7 Seed Ticket Tiers
INSERT INTO ticket_tiers (id, event_id, tier_name, price, total_capacity, sold_count, perks)
VALUES
    (
        'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
        'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
        'Early Bird Soiree Pass',
        1499,
        40,
        0,
        ARRAY['Sunset Rooftop Access', '1 Artisanal Beverage', 'Gourmet Tapas Platter', 'Dastan Community Table Access']
    ),
    (
        'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
        'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
        'VIP Storyteller Experience',
        2499,
        20,
        0,
        ARRAY['Stagefront Priority Seating', 'Free-Flow Curated Beverages', 'Private Sommelier Pairing', 'Exclusive Artist Meet & Greet']
    );

-- Done! Fresh database ready.
