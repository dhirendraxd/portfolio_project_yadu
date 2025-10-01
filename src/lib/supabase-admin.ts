import { createClient } from '@supabase/supabase-js';

// Admin client with service role for admin operations
const supabaseUrl = 'https://zbarlmruuuxldcxabutt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiYXJsbXJ1dXV4bGRjeGFidXR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTg4NjYzNywiZXhwIjoyMDY3NDYyNjM3fQ.T5pEqy7xYjJXyPGULM6Et6fgQJlEu6EhOD8MgE9iJZg';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    storage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    }
  }
});