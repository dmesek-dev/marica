import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client using the service-role key.
// The service-role key bypasses Row Level Security and must NEVER be shipped to
// the browser — it is only imported from server code (route handlers / server
// components) thanks to the `server-only` guard above.
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase nije konfiguriran. Postavi SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY u environment varijablama.'
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
