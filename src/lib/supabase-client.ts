import createClient from './supabase/client';
import { Database } from '@/types/database';

const supabaseClient = createClient<Database>();

export default supabaseClient;
