import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

let supabaseClient: any = null;

export const initSupabase = () => {
  if (typeof window === 'undefined') return null;

  if (!supabaseClient) {
    supabaseClient = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
  }

  return supabaseClient;
};

export const getSupabaseClient = () => {
  return supabaseClient;
};
