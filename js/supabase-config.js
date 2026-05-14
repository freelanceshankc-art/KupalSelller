// ============================================
// SUPABASE CONFIGURATION
// Replace these with your actual Supabase project credentials
// ============================================

const SUPABASE_URL = 'https://soycqmjnjqkmbinzfrnf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNveWNxbWpuanFrbWJpbnpmcm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MjkzNzgsImV4cCI6MjA5NDMwNTM3OH0.9dEaN4ZOMZfQtB-547UzlNmfOkzsfuT7Xu9oXOMGTTs';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
