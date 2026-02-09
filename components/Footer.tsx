
import React from 'react';
import { MapPin, Phone, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-pink-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white text-lg">🌈</div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">Mundo Mágico</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-medium">
              Excelencia y calidez en cada detalle. Creamos el entorno ideal para festejos que perduran en el corazón.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase font-black text-gray-900 tracking-[0.2em]">Ubicación y Contacto</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li className="flex items-center gap-3"><MapPin size={16} className="text-pink-400" /> Av. Principal 1234, CABA</li>
              <li className="flex items-center gap-3"><Phone size={16} className="text-pink-400" /> +54 9 11 2233 4455</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase font-black text-gray-900 tracking-[0.2em]">Horarios de Atención</h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Lunes a Sábado: 10:00 - 19:00</p>
              <p className="text-[10px] text-pink-400 font-black uppercase tracking-widest">Domingos solo eventos</p>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em] text-center md:text-left">
            © {new Date().getFullYear()} Mundo Mágico Salón
          </p>
          <div className="flex gap-10">
            <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors p-2"><Instagram size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors p-2"><Facebook size={24} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Added missing default export
export default Footer;
