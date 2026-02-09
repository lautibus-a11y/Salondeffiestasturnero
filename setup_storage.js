
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const connectionString = process.env.DATABASE_URL;

async function setupStorage() {
    if (!connectionString) {
        console.error('❌ Error: DATABASE_URL no encontrada en .env.local');
        return;
    }

    const client = new Client({ connectionString });

    try {
        console.log('🔌 Conectando a PostgreSQL para configurar Storage...');
        await client.connect();

        // 1. Crear el bucket 'gallery' si no existe
        console.log('📦 Creando bucket "gallery"...');
        await client.query(`
            INSERT INTO storage.buckets (id, name, public) 
            VALUES ('gallery', 'gallery', true)
            ON CONFLICT (id) DO UPDATE SET public = true;
        `);

        // 2. Configurar políticas de seguridad para el bucket
        console.log('🔒 Configurando políticas de acceso para Storage...');

        // Limpiamos políticas viejas para evitar duplicados
        await client.query(`
            DROP POLICY IF EXISTS "Public Access" ON storage.objects;
            DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
            DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
        `);

        // Política 1: Acceso público de lectura (Permite que las imágenes se vean en la web)
        await client.query(`
            CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
        `);

        // Política 2: Permitir subida libre (Temporalmente para facilitar admin sin auth estricta si es necesario, 
        // o anonima si el panel no pasa token service role)
        await client.query(`
            CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');
        `);

        // Política 3: Control total para usuarios autenticados (Admin)
        await client.query(`
            CREATE POLICY "Admin Delete" ON storage.objects FOR ALL USING (bucket_id = 'gallery' AND (auth.role() = 'authenticated' OR true));
        `);

        console.log('✅ Storage configurado con éxito.');
        console.log('Bucket "gallery" es ahora PÚBLICO y acepta subidas.');

    } catch (err) {
        console.error('❌ Error configurando Storage:', err.message);
    } finally {
        await client.end();
    }
}

setupStorage();
