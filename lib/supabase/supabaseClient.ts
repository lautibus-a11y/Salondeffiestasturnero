
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Faltan las variables de entorno de Supabase (Públicas)');
}

// Cliente público para uso en el frontend
// Seguridad garantizada mediante Row Level Security (RLS) en la base de datos
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
