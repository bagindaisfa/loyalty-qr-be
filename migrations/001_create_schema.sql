-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================
-- 1. TENANTS
-- ========================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  subscription_tier TEXT CHECK (subscription_tier IN ('basic', 'pro', 'premium')),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- 2. TENANT SETTINGS
-- ========================
CREATE TABLE tenant_settings (
  tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  reward_type TEXT CHECK (reward_type IN ('point', 'coin')) DEFAULT 'point',
  point_per_rupiah NUMERIC DEFAULT 0.1,
  min_transaction NUMERIC DEFAULT 0,
  card_mode_enabled BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- 3. USERS
-- ========================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- 4. USER BALANCES
-- ========================
CREATE TABLE user_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  balance NUMERIC DEFAULT 0,
  reward_type TEXT CHECK (reward_type IN ('point', 'coin')) DEFAULT 'point',
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, tenant_id)
);

-- ========================
-- 5. QR CODES
-- ========================
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  point_value NUMERIC DEFAULT 1,
  target_phone TEXT,
  is_used BOOLEAN DEFAULT FALSE,
  used_by_user_id UUID REFERENCES users(id),
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- ========================
-- 6. REWARD LOGS
-- ========================
CREATE TABLE reward_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('claim', 'redeem')),
  amount NUMERIC NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- 7. MEMBER CARDS
-- ========================
CREATE TABLE member_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  tenant_id UUID REFERENCES tenants(id),
  card_number TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- 8. SUPPORT TICKETS
-- ========================
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  title TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'open',
  assigned_to TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- ========================
-- 9. SUBSCRIPTIONS
-- ========================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  tier TEXT CHECK (tier IN ('basic', 'pro', 'premium')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT CHECK (status IN ('active', 'expired', 'grace')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- 10. ADMINS
-- ========================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('internal', 'tenant')) NOT NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);
