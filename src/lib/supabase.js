import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Verify key is set and not a placeholder
const isPlaceholderKey = publishableKey.includes('your-supabase-publishable');

export const isSupabaseConfigured = Boolean(
  supabaseUrl && publishableKey && !isPlaceholderKey
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, publishableKey)
  : null;
