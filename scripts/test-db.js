const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        process.env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
      }
    }
  }
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ptnnqyzepdpvufismcvp.supabase.co';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function checkDatabase() {
  console.log('⚡ Checking Dastan Experiences Supabase Database Connection...');
  console.log(`Endpoint: ${supabaseUrl}`);

  const tables = [
    'profiles',
    'vendors',
    'events',
    'ticket_tiers',
    'restaurants',
    'restaurant_offers',
    'bookings',
    'payments',
    'promo_codes',
    'admin_settings',
  ];

  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`❌ Table "${table}": ERROR (${error.message})`);
    } else {
      console.log(`✅ Table "${table}": LIVE (Count: ${count ?? 0})`);
    }
  }

  const { data: events, error: evErr } = await supabase
    .from('events')
    .select('id, title, city, ticket_tiers(id, tier_name, price)')
    .limit(1);

  if (!evErr && events && events.length > 0) {
    console.log(`\n🎉 Connection verified! Sample Experience: "${events[0].title}" in ${events[0].city}`);
  }
}

checkDatabase().catch(console.error);
