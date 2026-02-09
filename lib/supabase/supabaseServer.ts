
import { createClient } from '@supabase/supabase-js';

/**
 * CLIENTE SUPABASE (SERVER ONLY)
 * 
 * PELIGRO: Este cliente utiliza la SERVICE_ROLE_KEY, la cual salta todas las políticas de RLS.
 * NUNCA debe ser importado ni ejecutado en el lado del cliente (navegador).
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Usamos una variable sin el prefijo VITE_ para asegurar que Vite no la incluya en el bundle del cliente
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (typeof window !== 'undefined') {
    console.warn('⚠️ SEGURIDAD: Intentando usar el cliente administrativo en el navegador. Operación bloqueada.');
}

export const getSupabaseAdmin = () => {
    if (typeof window !== 'undefined') {
        throw new Error('El cliente administrativo solo puede usarse en entornos de servidor.');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Faltan las variables de entorno de Supabase (Admin)');
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
};
