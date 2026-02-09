
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SERVICES as FALLBACK_SERVICES } from '../constants';
import { db } from '../utils';

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
    <section id="servicios" className="py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            Nuestra Propuesta
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Servicios exclusivos</h2>
          <p className="text-gray-400 text-lg max-w-sm mx-auto font-medium">Todo pensado para crear la fiesta perfecta.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title + index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-10 bg-gray-50/50 rounded-[2.5rem] border border-transparent hover:border-pink-100 hover:bg-white hover:shadow-2xl hover:shadow-pink-100/30 transition-all group relative overflow-hidden"
            >
              <div className="text-5xl mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 inline-block">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {service.description}
              </p>
              <div className="absolute bottom-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
