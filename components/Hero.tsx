
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Heart, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../utils';
import Particles from './Particles';

const Hero: React.FC = () => {
  const [content, setContent] = useState({
    title: 'Donde los sueños cobran vida',
    description: 'Un espacio sofisticado y alegre diseñado para que cada festejo sea una historia inolvidable. Diversión de calidad para los más pequeños.',
    image: 'https://images.unsplash.com/photo-1530103862676-fa39665a53bb?q=80&w=2070&auto=format&fit=crop'
  });

  useEffect(() => {
    const fetchContent = async () => {
      const heroData = await db.getContent('hero');
      if (heroData) setContent(heroData);
    };
    fetchContent();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden bg-[#fafafa]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[80%] h-[80%] bg-gradient-to-br from-pink-100/40 to-purple-100/40 rounded-full blur-[100px] opacity-70"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -left-[10%] w-[70%] h-[70%] bg-gradient-to-tr from-blue-100/30 to-pink-100/30 rounded-full blur-[90px] opacity-60"
        />
        <Particles />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="text-center lg:text-left order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-pink-100 shadow-lg shadow-pink-100/20 mb-8"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-pink-100 flex items-center justify-center text-[8px]">👶</div>
              ))}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-pink-500 ml-2">Explosión de Diversión</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-8 lg:mb-10 leading-[0.95] tracking-tighter"
          >
            <span className="block">{content.title.split(' ').slice(0, 3).join(' ')}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 block sm:inline">
              {content.title.split(' ').slice(3).join(' ')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-500/80 mb-10 lg:mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 lg:gap-8"
          >
            <Link
              to="/#reserva"
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-pink-600 text-white px-10 py-5 lg:px-12 lg:py-6 rounded-2xl text-sm font-black transition-all uppercase tracking-[0.2em] shadow-xl shadow-pink-200 flex items-center justify-center gap-3 cursor-pointer"
            >
              Agendar ahora
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/#nosotros"
              className="group flex items-center gap-4 text-gray-900 font-black text-sm uppercase tracking-widest cursor-pointer"
            >
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white shadow-xl flex items-center justify-center group-hover:bg-pink-50 transition-all border border-gray-100">
                <Play size={18} className="text-pink-500 fill-pink-500" />
              </div>
              Nuestro Salón
            </Link>
          </motion.div>
        </div>

        {/* Visual Composition - Now visible on mobile with adjusted layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative order-1 lg:order-2 px-4 lg:px-0"
        >
          {/* Main Card with adjusted mobile sizing */}
          <div className="relative z-10 bg-white/40 backdrop-blur-xl rounded-[2.5rem] lg:rounded-[3rem] border border-white/50 p-6 lg:p-10 shadow-2xl shadow-pink-100/20 rotate-1 lg:rotate-3 max-w-md mx-auto">
            <img
              src={content.image}
              className="rounded-2xl lg:rounded-[2rem] w-full h-[250px] lg:h-[500px] object-cover object-center shadow-2xl mb-6 lg:mb-8"
              alt="Salón Mundo Mágico"
            />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] lg:text-[10px] font-black uppercase text-pink-400 tracking-widest">Premium Space</p>
                <p className="text-lg lg:text-xl font-black text-gray-900">Salón Principal</p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
              </div>
            </div>
          </div>

          {/* Floating Badges - Positioned carefully for mobile */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -left-2 lg:-top-10 lg:-left-10 z-20 bg-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-2xl border border-pink-50 flex items-center gap-3 lg:gap-4"
          >
            <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-pink-500 flex items-center justify-center text-white">
              <Heart size={16} className="fill-white" />
            </div>
            <div>
              <p className="text-[10px] lg:text-xs font-black text-gray-900 uppercase lg:normal-case">Seguridad</p>
              <p className="hidden lg:block text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Área Monitoreada</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-4 -right-2 lg:-bottom-10 lg:-right-10 z-20 bg-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-2xl border border-blue-50 flex items-center gap-3 lg:gap-4"
          >
            <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-blue-500 flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-[10px] lg:text-xs font-black text-gray-900 uppercase lg:normal-case">Magia</p>
              <p className="hidden lg:block text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Eventos Únicos</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
