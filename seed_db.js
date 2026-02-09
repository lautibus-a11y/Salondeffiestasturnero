
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

const INITIAL_SERVICES = [
    {
        title: 'Pelotero Gigante',
        description: 'Tres niveles de diversión con toboganes y laberintos.',
        icon: '🎡'
    },
    {
        title: 'Menú Infantil',
        description: 'Comida saludable y deliciosa preparada especialmente para los peques.',
        icon: '🍕'
    },
    {
        title: 'Animación Profesional',
        description: 'Juegos temáticos, magia y mucha energía para que nadie se aburra.',
        icon: '🎭'
    },
    {
        title: 'Zona Blanda',
        description: 'Espacio seguro y estimulante para los más pequeñitos de 1 a 3 años.',
        icon: '🧸'
    }
];

const INITIAL_HERO = {
    title: 'Donde los sueños cobran vida',
    description: 'Un espacio sofisticado y alegre diseñado para que cada festejo sea una historia inolvidable. Diversión de calidad para los más pequeños.'
};

const INITIAL_GALLERY = [
    'https://picsum.photos/seed/party1/800/600',
    'https://picsum.photos/seed/party2/800/600',
    'https://picsum.photos/seed/party3/800/600',
    'https://picsum.photos/seed/party4/800/600',
    'https://picsum.photos/seed/party5/800/600'
];

async function seedDatabase() {
    console.log('🚀 Iniciando carga automática de datos...');

    try {
        // 1. Cargar Servicios
        console.log('📦 Cargando servicios...');
        const { error: sError } = await supabase
            .from('site_content')
            .upsert({ key: 'services', value: INITIAL_SERVICES });
        if (sError) throw sError;

        // 2. Cargar Hero
        console.log('✨ Cargando contenido hero...');
        const { error: hError } = await supabase
            .from('site_content')
            .upsert({ key: 'hero', value: INITIAL_HERO });
        if (hError) throw hError;

        // 3. Cargar Galería
        console.log('🖼️ Cargando galería...');
        const { error: gError } = await supabase
            .from('site_content')
            .upsert({ key: 'gallery', value: INITIAL_GALLERY });
        if (gError) throw gError;

        console.log('✅ ¡DATOS CARGADOS CON ÉXITO!');
        console.log('Ahora tu web está sincronizada con Supabase y puedes administrar todo desde el panel.');

    } catch (err) {
        if (err.code === '42P01') {
            console.error('❌ ERROR: La tabla "site_content" no existe aún.');
            console.error('Asegúrate de haber ejecutado el código SQL en el editor de Supabase.');
        } else {
            console.error('❌ Error inesperado:', err.message);
        }
    }
}

seedDatabase();
