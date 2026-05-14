-- Run this SQL in your Supabase SQL Editor to create the required table

-- Table to store all subscription reports
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  supplier_username TEXT NOT NULL,
  platform TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups on email+password matching
CREATE INDEX idx_reports_email_password ON reports (email, password);

-- Index for tracking repeated sellers
CREATE INDEX idx_reports_supplier ON reports (supplier_username, platform);

-- Enable Row Level Security (optional - disable if you want open access for demo)
-- ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policy to allow anonymous inserts (for the submission form)
-- CREATE POLICY "Allow anonymous inserts" ON reports FOR INSERT WITH CHECK (true);

-- Policy to allow anonymous reads (for matching and admin)
-- CREATE POLICY "Allow anonymous reads" ON reports FOR SELECT USING (true);
