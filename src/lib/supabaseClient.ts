import { createClient } from '@supabase/supabase-js';

// Substitua com suas credenciais do Supabase
// O ideal é utilizar variáveis de ambiente (process.env.SUPABASE_URL), mas como solicitado:
const supabaseUrl = process.env.SUPABASE_URL || 'https://lburkceixpqptureemlv.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_uUmxe5RpDr2DEhjahwT6tQ_0BBw64vw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
