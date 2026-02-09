
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Faltan variables de entorno en .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
    console.log('🔍 Verificando estado de la base de datos...');

    // 1. Verificar tabla bookings
    console.log('--- Tabla: bookings ---');
    const { data: bookings, error: bError } = await supabase.from('bookings').select('id').limit(1);
    if (bError) {
        if (bError.code === '42P01') {
            console.log('❌ ERROR: La tabla "bookings" NO existe.');
        } else {
            console.log(`❌ ERROR al leer "bookings": ${bError.message} (Código: ${bError.code})`);
        }
    } else {
        console.log('✅ Tabla "bookings" existe.');
    }

    // 2. Verificar tabla site_content
    console.log('\n--- Tabla: site_content ---');
    const { data: content, error: cError } = await supabase.from('site_content').select('key').limit(1);
    if (cError) {
        if (cError.code === '42P01') {
            console.log('❌ ERROR: La tabla "site_content" NO existe.');
        } else {
            console.log(`❌ ERROR al leer "site_content": ${cError.message} (Código: ${cError.code})`);
        }
    } else {
        console.log('✅ Tabla "site_content" existe.');
    }

    console.log('\n💡 Sugerencia: Si las tablas no existen, debes copiar el SQL que te pasé en la consola de Supabase.');
}

testConnection();
