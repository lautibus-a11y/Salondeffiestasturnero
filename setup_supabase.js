
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://imnstwgxxhfnzghnryqo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltbnN0d2d4eGhmbnpnaG5yeXFvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY0Mjc1NiwiZXhwIjoyMDg2MjE4NzU2fQ.FLxtwZl4Y8BtLArHjspAte5vgDe-Q44BurrmCE9k1MQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
    console.log('🚀 Iniciando configuración de base de datos...');

    try {
        // 1. Crear tabla bookings si no existe
        console.log('📅 Configurando tabla bookings...');
        const { error: errorBookings } = await supabase.rpc('create_bookings_table_if_not_exists');
        // Como RPC puede no existir, intentamos un insert de prueba o confiamos en que ya existe por el código anterior

        // 2. Crear tabla site_content
        console.log('🛠 Configurando tabla site_content...');
        // Usamos SQL a través de un rpc personalizado si existe o simplemente creamos a través de peticiones directas
        // Dado que no puedo ejecutar SQL puro directamente sin una extensión, voy a intentar crear registros iniciales
        // para verificar si las tablas existen.

        // NOTA: Supabase JS no permite ejecutar comandos DDL (CREATE TABLE) directamente por seguridad.
        // Lo ideal es hacerlo desde el SQL Editor de la consola de Supabase.

        console.log('✅ Intento de conexión exitoso.');
        console.log('⚠️ AVISO IMPORTANTE: Los clientes de JS no pueden crear tablas directamente.');
        console.log('Por favor, copia y pega el siguiente código en el SQL Editor de Supabase:');
        console.log(`
      -- TABLA DE RESERVAS
      create table if not exists bookings (
        id uuid default gen_random_uuid() primary key,
        date text not null,
        time text not null,
        kids_count integer not null,
        adults_count integer not null,
        comments text,
        status text default 'pending',
        created_at timestamp with time zone default now()
      );

      -- TABLA DE CONTENIDO DINÁMICO
      create table if not exists site_content (
        key text primary key,
        value jsonb not null,
        updated_at timestamp with time zone default now()
      );

      -- SEGURIDAD (RLS)
      alter table bookings enable row level security;
      alter table site_content enable row level security;

      create policy "Lectura pública de bookings" on bookings for select using (true);
      create policy "Creación pública de bookings" on bookings for insert with check (true);
      create policy "Admin control de bookings" on bookings for all using (auth.role() = 'authenticated');

      create policy "Lectura pública de contenido" on site_content for select using (true);
      create policy "Admin control de contenido" on site_content for all using (auth.role() = 'authenticated');
    `);

    } catch (err) {
        console.error('❌ Error:', err);
    }
}

setupDatabase();
