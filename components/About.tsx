
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Star, ShieldCheck, ChevronRight, Sparkles, Plus } from 'lucide-react';
import { GALLERY_IMAGES as FALLBACK_IMAGES } from '../constants';
import { db } from '../utils';

const FeatureCard = ({ icon: Icon, title, desc, color }: any) => (
  <div className={`flex items-start gap-5 p-6 bg-${color}-50/50 rounded-2xl border border-${color}-100 transition-all hover:bg-white hover:shadow-lg hover:shadow-${color}-100/30`}>
    <div className={`p-3 bg-${color}-100 rounded-xl text-${color}-500 shadow-sm`}>
      <Icon size={22} />
    </div>
    <div>
      <h4 className="text-base font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

const About: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState(FALLBACK_IMAGES);
  const [content, setContent] = useState({
    image1: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
    image2: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=2070&auto=format&fit=crop'
  });

  useEffect(() => {
    const fetchGallery = async () => {
      const [dbGallery, dbAbout] = await Promise.all([
        db.getContent('gallery'),
        db.getContent('about')
      ]);
      if (dbGallery) setGallery(dbGallery);
      if (dbAbout) setContent(dbAbout);
    };
    fetchGallery();
  }, []);

  return (
    <section id="nosotros" className="py-28 bg-gradient-to-b from-pink-50/20 via-purple-50/10 to-blue-50/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-pink-100/40 to-purple-100/30 rounded-full blur-[150px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100/30 to-pink-100/40 rounded-full blur-[150px] opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                className="h-1.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-8"
              />
              <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-[0.95]">
                Más de una década <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">creando magia</span>
              </h2>
              <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                Desde nuestro primer evento en 2012, nos propusimos redefinir lo que significa una fiesta infantil. Hoy, somos el referente de celebraciones premium en la zona, combinando infraestructura de vanguardia con un equipo apasionado por los detalles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                <Heart className="text-pink-500 mb-4 relative z-10" size={32} />
                <h4 className="text-2xl font-black text-gray-900 mb-1 relative z-10">+1500</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest relative z-10">Familias Felices</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                <Star className="text-purple-500 mb-4 relative z-10" size={32} />
                <h4 className="text-2xl font-black text-gray-900 mb-1 relative z-10">12 Años</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest relative z-10">De Trayectoria</p>
              </motion.div>

              <div className="sm:col-span-2">
                <FeatureCard icon={ShieldCheck} title="Seguridad Certificada" desc="Contamos con monitoreo constante y protocolos de seguridad de alto estándar." color="blue" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Visual Composition */}
            <div className="relative grid grid-cols-2 gap-6 items-center">
              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02, rotate: -2 }}
                  className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[3/4]"
                >
                  <img
                    src={content.image1}
                    alt="Nuestro Salón"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Sparkles size={40} />
                  </div>
                  <p className="text-5xl font-black mb-1">Elite</p>
                  <p className="text-[10px] uppercase font-black text-pink-400 tracking-widest">Calificación del Lugar</p>
                </div>
              </div>

              <div className="space-y-6 mt-12">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-pink-50 relative overflow-hidden translate-x-4">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-gray-900 font-bold text-lg leading-tight mb-2">"El mejor salón que visitamos."</p>
                  <p className="text-[10px] uppercase font-black text-gray-300 tracking-widest">Google Reviews</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 2 }}
                  className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[3/4]"
                >
                  <img
                    src={content.image2}
                    alt="Detalles Premium"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
              </div>

              {/* Decorative Blur Background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-purple-600/10 blur-[100px] -z-10 rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* Gallery Section */}
        <div id="galeria" className="mt-40">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6"
            >
              <Sparkles size={12} /> Galería Exclusiva
            </motion.div>
            <h3 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter">Nuestro <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Salón</span></h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto font-medium">Cada rincón está diseñado para inspirar aventura y alegría.</p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {gallery.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="relative group cursor-pointer overflow-hidden rounded-[2rem] bg-gray-100 shadow-xl shadow-pink-100/10 break-inside-avoid"
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img}
                  alt={`Salón ${idx}`}
                  className="w-full h-auto min-h-[250px] max-h-[500px] object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 md:p-10">
                  <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[12px] font-black text-pink-400 uppercase tracking-[0.2em] mb-4">Click para ampliar</p>
                    <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                      <span className="text-white font-black text-xl uppercase tracking-widest">Ver detalle</span>
                      <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
                        <Plus size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glass Border on Hover */}
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-[2rem] transition-colors pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              whileHover={{ rotate: 90 }}
              className="absolute top-8 right-8 text-white bg-white/10 p-4 rounded-full hover:bg-white/20 transition-all z-20"
            >
              <X size={24} />
            </motion.button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              src={selectedImage}
              className="max-w-full max-h-[90vh] rounded-[2.5rem] shadow-2xl border-2 border-white/10 object-cover object-center"
              alt="Galería Mundo Mágico"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;
