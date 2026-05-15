-- Run this SQL in your Supabase SQL Editor to create the required table

-- Table to store all subscription reports
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  subscription_type TEXT NOT NULL,
  purchase_date DATE,
  issue_date DATE,
  supplier_username TEXT NOT NULL,
  platform TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups on email matching
CREATE INDEX idx_reports_email ON reports (email);

-- Index for tracking repeated sellers
CREATE INDEX idx_reports_supplier ON reports (supplier_username, platform);

-- ============================================
-- IF YOUR TABLE ALREADY EXISTS, run this instead to add the new columns:
-- ============================================
-- ALTER TABLE reports ADD COLUMN subscription_type TEXT;
-- ALTER TABLE reports ADD COLUMN purchase_date DATE;
-- ALTER TABLE reports ADD COLUMN issue_date DATE;

-- ============================================
-- TRUSTED SELLERS TABLE
-- ============================================
CREATE TABLE trusted_sellers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  platform TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- IF YOU ALREADY HAVE THE reports TABLE, just run this to add trusted_sellers:
-- ============================================
-- CREATE TABLE trusted_sellers (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   username TEXT NOT NULL,
--   platform TEXT NOT NULL,
--   added_at TIMESTAMPTZ DEFAULT NOW()
-- );



-- ============================================
-- BLACKLISTED SELLERS TABLE (Manual Kupal List)
-- ============================================
CREATE TABLE blacklisted_sellers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  platform TEXT NOT NULL,
  reason TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_blacklisted_username ON blacklisted_sellers (username, platform);

-- ============================================
-- IF YOU ALREADY HAVE OTHER TABLES, just run this:
-- ============================================
-- CREATE TABLE blacklisted_sellers (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   username TEXT NOT NULL,
--   platform TEXT NOT NULL,
--   reason TEXT NOT NULL,
--   added_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- CREATE INDEX idx_blacklisted_username ON blacklisted_sellers (username, platform);
