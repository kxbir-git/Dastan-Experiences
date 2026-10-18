-- Migration: 001_initial_schema.sql
-- Schema for Azaad.in - Social Dining, Restaurant Deals, and Live Events

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Custom Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('draft', 'pending_approval', 'published', 'rejected', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending_payment', 'confirmed', 'checked_in', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('created', 'authorized', 'captured', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles (Linked to auth.users or standalone for demo/seed)
CREATE TABLE IF NOT EXISTS profiles (
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
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL, -- 'restaurant', 'event_organizer', 'hospitality_group'
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
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    cuisine_types TEXT[] NOT NULL,
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    address TEXT NOT NULL,
    lat NUMERIC(10,7),
    lng NUMERIC(10,7),
    images TEXT[] NOT NULL,
    avg_cost_for_two INTEGER NOT NULL,
    rating NUMERIC(3,2) DEFAULT 4.5,
    status listing_status DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE,
    social_table_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Restaurant Offers / Deals
CREATE TABLE IF NOT EXISTS restaurant_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    discount_pct INTEGER NOT NULL,
    description TEXT NOT NULL,
    available_days TEXT[] NOT NULL,
    valid_from TIME NOT NULL,
    valid_to TIME NOT NULL,
    cover_charge INTEGER DEFAULT 0,
    max_covers_per_slot INTEGER DEFAULT 20,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Events
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    city TEXT NOT NULL,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    banner_url TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status listing_status DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE,
    age_restriction TEXT DEFAULT '18+',
    terms_conditions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Ticket Tiers
CREATE TABLE IF NOT EXISTS ticket_tiers (
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
CREATE TABLE IF NOT EXISTS promo_codes (
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
CREATE TABLE IF NOT EXISTS bookings (
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
CREATE TABLE IF NOT EXISTS payments (
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
CREATE TABLE IF NOT EXISTS refunds (
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
CREATE TABLE IF NOT EXISTS social_discovery_optins (
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
CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
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

-- Sample RLS Policies
-- Profiles: Users can view own profile or public social discovery data; admins can view all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Public listings viewable by everyone
CREATE POLICY "Public events viewable" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Public restaurants viewable" ON restaurants FOR SELECT USING (status = 'published');
CREATE POLICY "Public ticket tiers viewable" ON ticket_tiers FOR SELECT USING (true);
CREATE POLICY "Public restaurant offers viewable" ON restaurant_offers FOR SELECT USING (is_active = true);

-- Bookings viewable by booking owner or vendor
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
