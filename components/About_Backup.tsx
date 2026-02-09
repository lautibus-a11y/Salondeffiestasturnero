
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Star, ShieldCheck, ChevronRight } from 'lucide-react';
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

  useEffect(() => {
    const fetchGallery = async () => {
      const dbGallery = await db.getContent('gallery');
      if (dbGallery) setGallery(dbGallery);
    };
    fetchGallery();
  }, []);

  return (
    <section id="nosotros" className="py-28 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <div className="w-12 h-1 bg-pink-500 rounded-full mb-6" />
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
                Nuestra historia <br />
                <span className="text-pink-500">en cada sonrisa</span>
              </h2>
              <p className="text-xl text-gray-400 font-medium leading-relaxed">
                Combinamos elegancia y diversión para ofrecer un entorno donde la seguridad y la alegría se encuentran en cada rincón.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FeatureCard icon={Heart} title="Atención personalizada" desc="Planificamos cada detalle junto a vos." color="pink" />
              <FeatureCard icon={Star} title="Espacios Premium" desc="Instalaciones seguras y de alta calidad." color="purple" />
              <FeatureCard icon={ShieldCheck} title="Seguridad integral" desc="Ambientes controlados para total tranquilidad." color="blue" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6 relative"
          >
            <div className="absolute inset-0 bg-pink-100/20 blur-[80px] -z-10 rounded-full" />
            <div className="space-y-6 mt-12">
              <img src="https://picsum.photos/seed/saloon1/400/500" alt="Detalle" className="rounded-3xl w-full h-[350px] object-cover shadow-2xl" />
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-8 rounded-[2.5rem] text-white shadow-xl">
                <p className="text-4xl font-black mb-1">10+</p>
                <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">Años de Magia</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-pink-50">
                <p className="text-4xl font-black text-pink-500 mb-1">5k+</p>
                <p className="text-[10px] uppercase font-black text-gray-300 tracking-widest">Momentos</p>
              </div>
              <img src="https://picsum.photos/seed/saloon2/400/500" alt="Ambiente" className="rounded-3xl w-full h-[350px] object-cover shadow-2xl" />
            </div>
          </motion.div>
        </div>

        {/* Gallery Section */}
        <div className="mt-20">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Nuestro Salón</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto font-medium">Explorá cada rincón de nuestro espacio diseñado para la aventura.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {gallery.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8, scale: 1.02 }}
                className="aspect-[4/5] relative group cursor-pointer overflow-hidden rounded-3xl bg-gray-100 shadow-lg shadow-pink-100/20"
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={`Salón ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-pink-500 shadow-xl">
                    <ChevronRight size={24} />
                  </div>
                </div>
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
            className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white bg-white/10 p-4 rounded-full hover:bg-white/20 transition-all">
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedImage}
              className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl border-4 border-white/10"
              alt="Ampliada"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;
