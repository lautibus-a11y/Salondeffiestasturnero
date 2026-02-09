# Mundo Mágico - Salón de Fiestas Infantiles

Sistema de turnero online premium con panel de administración integrado.

## 🚀 Deploy en Vercel

### Variables de Entorno Requeridas

Antes de hacer el deploy, configurá estas variables en Vercel:

1. `VITE_SUPABASE_URL` - URL de tu proyecto Supabase
2. `VITE_SUPABASE_ANON_KEY` - Clave pública (anon key) de Supabase

### Pasos para Deploy

1. **Conectar con GitHub:**
   ```bash
   vercel --prod
   ```

2. **O desde la interfaz de Vercel:**
   - Importá el repositorio desde GitHub
   - Vercel detectará automáticamente que es un proyecto Vite
   - Agregá las variables de entorno en Settings → Environment Variables

3. **Build automático:**
   - Vercel ejecutará `npm run build` automáticamente
   - El directorio de salida es `dist/`

## 📦 Estructura del Proyecto

```
├── components/          # Componentes React
├── lib/                # Configuración de Supabase
├── dist/               # Build de producción (generado)
├── index.html          # HTML principal
├── index.tsx           # Entry point de React
├── App.tsx             # Componente raíz
├── utils.ts            # Utilidades y helpers
├── types.ts            # Tipos TypeScript
└── vercel.json         # Configuración de Vercel
```

## 🛠️ Desarrollo Local

```bash
npm install
npm run dev
```

## 🔒 Seguridad

- Row Level Security (RLS) habilitado en Supabase
- Headers de seguridad configurados en Vercel
- Variables de entorno protegidas

## 📱 Características

- ✅ Responsive design (Mobile-first)
- ✅ Panel de administración completo
- ✅ Sistema de reservas en tiempo real
- ✅ Gestión de contenido dinámico
- ✅ Galería de imágenes con upload
- ✅ Integración con WhatsApp
- ✅ SEO optimizado
