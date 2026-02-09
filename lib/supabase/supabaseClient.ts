
import { createClient } from '@supabase/supabase-js';

// Fallback para Vercel (si no hay variables de entorno configuradas)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://imnstwgxxhfnzghnryqo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltbnN0d2d4eGhmbnpnaG5yeXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NDI3NTYsImV4cCI6MjA4NjIxODc1Nn0.CaTkkKPzYBUoiEfI_-13sjX8C0Hg3xkavDj95MtOd7I';

// Cliente público para uso en el frontend
// Seguridad garantizada mediante Row Level Security (RLS) en la base de datos
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
