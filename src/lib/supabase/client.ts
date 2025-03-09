
// src/lib/supabase/client.ts

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://ebyaurtxnxogxfvjaqxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVieWF1cnR4bnhvZ3hmdmphcXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjAyNjYsImV4cCI6MjA1Njc5NjI2Nn0.s05X6pAPjaY0MAdUubTXQWEONdCU6bDygjcSv586MLg';

// Check if Supabase is configured properly
const isSupabaseConfigured = supabaseUrl && supabaseKey;
if (!isSupabaseConfigured) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to check if Supabase is configured before making API calls
export const requireSupabase = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Missing Supabase environment variables. Please set up the Supabase integration.');
  }
  return supabase;
};
