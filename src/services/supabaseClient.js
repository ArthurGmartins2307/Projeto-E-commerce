import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verifica se as credenciais do Supabase foram preenchidas no arquivo .env
const hasValidSupabaseUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(supabaseUrl);
const hasRealAnonKey = !!supabaseAnonKey && !supabaseAnonKey.includes('SUA_CHAVE');

export const isSupabaseConfigured = hasValidSupabaseUrl && hasRealAnonKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
