
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SERVICES as FALLBACK_SERVICES } from '../constants';
import { db } from '../utils';
import { Sparkles, Star } from 'lucide-react';

const Services: React.FC = () => {
  const [services, setServices] = useState(FALLBACK_SERVICES);

  useEffect(() => {
    const fetchServices = async () => {
      const dbServices = await db.getContent('services');
      if (dbServices) setServices(dbServices);
    };
    fetchServices();
  }, []);

  return (
    <section id="servicios" className="py-32 bg-white relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-pink-50 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-purple-50 rounded-full blur-[100px] opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-28">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Sparkles size={12} /> Transformamos Momentos
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter"
          >
            Servicios <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Premium</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-xl mx-auto font-medium leading-relaxed"
          >
            Diseñamos cada detalle para que tu único trabajo sea disfrutar y crear recuerdos inolvidables.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title + index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="relative group h-full"
            >
              {/* Card Background with Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-600/5 rounded-[3rem] transition-all duration-500 group-hover:from-pink-500/10 group-hover:to-purple-600/10 blur-sm" />

              <div className="relative h-full p-10 bg-white/70 backdrop-blur-xl rounded-[3rem] border border-white shadow-xl shadow-gray-100/50 group-hover:shadow-2xl group-hover:shadow-pink-100/40 transition-all duration-500 overflow-hidden flex flex-col">
                {/* Decorative circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700" />

                <div className="relative mb-10 w-20 h-20 bg-gradient-to-br from-white to-gray-50 rounded-2xl flex items-center justify-center text-4xl shadow-lg border border-gray-100 group-hover:rotate-6 transition-all duration-500">
                  {service.icon}
                  {/* Floating sparkles in icon box */}
                  <div className="absolute -top-2 -right-2 text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Star size={16} fill="currentColor" />
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-2xl font-black text-gray-900 mb-5 tracking-tight group-hover:text-pink-500 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-500/80 text-base leading-relaxed font-medium">
                    {service.description}
                  </p>
                </div>

                {/* Bottom line indicator */}
                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-pink-300 transition-colors">
                    0{index + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-pink-500 group-hover:text-white transition-all duration-500">
                    <Sparkles size={14} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
