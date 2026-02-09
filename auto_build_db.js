
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const connectionString = process.env.DATABASE_URL;

async function verifyAndBuild() {
    const client = new Client({ connectionString });

    try {
        console.log('🔌 Conectando directamente a PostgreSQL...');
        await client.connect();
        console.log('✅ Conexión establecida con éxito.');

        // 1. Verificar y Crear site_content si falta
        console.log('🛠 Verificando estructura de site_content...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
        console.log('✅ Tabla site_content lista.');

        // 2. Verificar y Crear bookings si falta
        console.log('🛠 Verificando estructura de bookings...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        kids_count INTEGER NOT NULL,
        adults_count INTEGER NOT NULL,
        comments TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
        console.log('✅ Tabla bookings lista.');

        // 3. Configurar RLS y Políticas Automáticamente
        console.log('🔒 Configurando políticas de seguridad (RLS)...');

        // Habilitar RLS
        await client.query('ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;');
        await client.query('ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;');

        // Limpiar políticas existentes para evitar errores de duplicado
        await client.query('DROP POLICY IF EXISTS "Public Select Bookings" ON bookings;');
        await client.query('DROP POLICY IF EXISTS "Public Insert Bookings" ON bookings;');
        await client.query('DROP POLICY IF EXISTS "Admin All Bookings" ON bookings;');
        await client.query('DROP POLICY IF EXISTS "Public Select Content" ON site_content;');
        await client.query('DROP POLICY IF EXISTS "Admin All Content" ON site_content;');

        // Crear nuevas políticas
        await client.query('CREATE POLICY "Public Select Bookings" ON bookings FOR SELECT USING (true);');
        await client.query('CREATE POLICY "Public Insert Bookings" ON bookings FOR INSERT WITH CHECK (true);');
        await client.query('CREATE POLICY "Admin All Bookings" ON bookings FOR ALL USING (auth.role() = \'authenticated\');');

        await client.query('CREATE POLICY "Public Select Content" ON site_content FOR SELECT USING (true);');
        await client.query('CREATE POLICY "Admin All Content" ON site_content FOR ALL USING (auth.role() = \'authenticated\');');

        console.log('✅ Políticas de seguridad configuradas.');
        console.log('\n🚀 MODO CONSTRUCCIÓN AUTOMÁTICA ACTIVADO.');
        console.log('De ahora en adelante, crearé cualquier tabla que necesites sin que toques el SQL Editor.');

    } catch (err) {
        console.error('❌ Error crítico en la infraestructura:', err.message);
    } finally {
        await client.end();
    }
}

verifyAndBuild();
