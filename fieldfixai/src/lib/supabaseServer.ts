import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseServiceRoleKey && !supabaseAnonKey) {
  throw new Error(
    'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable'
  );
}

export const supabaseServer = createClient(
  supabaseUrl,
  supabaseServiceRoleKey ?? supabaseAnonKey!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
