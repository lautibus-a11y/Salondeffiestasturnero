
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { db } from '../utils';

const Hero: React.FC = () => {
  const [content, setContent] = useState({
    title: 'Donde los sueños cobran vida',
    description: 'Un espacio sofisticado y alegre diseñado para que cada festejo sea una historia inolvidable. Diversión de calidad para los más pequeños.'
  });

  useEffect(() => {
    const fetchContent = async () => {
      const heroData = await db.getContent('hero');
      if (heroData) setContent(heroData);
    };
    fetchContent();
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden bg-white">
      {/* Soft Colorful Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[5%] right-[0%] w-[50%] h-[70%] bg-pink-100 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[5%] left-[0%] w-[40%] h-[50%] bg-blue-100 rounded-full blur-[110px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 text-pink-500 font-bold mb-8"
          >
            <Sparkles size={16} className="animate-pulse" />
            <span className="uppercase tracking-[0.3em] text-[10px]">Experiencias Mágicas</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-[1] tracking-tight whitespace-pre-line"
          >
            {content.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-500 mb-12 max-w-xl leading-relaxed font-medium"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-wrap items-center gap-6"
          >
            <motion.a
              whileHover={{ y: -3, boxShadow: "0 20px 40px rgba(244, 114, 182, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              href="#reserva"
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-10 py-5 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-pink-100 uppercase tracking-widest"
            >
              Reservar ahora
            </motion.a>

            <motion.a
              whileHover={{ x: 5 }}
              href="#nosotros"
              className="text-gray-700 font-bold text-sm flex items-center gap-3 group uppercase tracking-widest"
            >
              Ver salón
              <div className="w-10 h-10 rounded-full border border-pink-100 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                <ArrowRight size={18} className="text-pink-500" />
              </div>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
