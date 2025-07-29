import { createBrowserClient } from '@supabase/ssr';
import { env } from '../../lib/env';
import { Database } from '../../types/database';

function createClient() {
  return createBrowserClient<Database>(
    env().NEXT_PUBLIC_SUPABASE_URL,
    env().NEXT_PUBLIC_SUPABASE_BASE_KEY
  );
}

export const supabaseClient = createClient();
export default createClient;
