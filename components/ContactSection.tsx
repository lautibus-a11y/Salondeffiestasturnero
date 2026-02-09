
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Instagram, ExternalLink } from 'lucide-react';
import { db } from '../utils';

const ContactSection: React.FC = () => {
    const [content, setContent] = useState({
        title: '¿Tenés alguna duda?',
        subtitle: 'Estamos para ayudarte a que el festejo sea perfecto.',
        address: 'Av. Principal 1234, CABA',
        phone: '+54 9 11 2233 4455',
        instagram: '@mundomagico_salon',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop'
    });

    useEffect(() => {
        const fetchContact = async () => {
            const dbContact = await db.getContent('contact');
            if (dbContact) setContent(dbContact);
        };
        fetchContact();
    }, []);

    return (
        <section id="contacto" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row items-stretch">

                    {/* Text Content */}
                    <div className="flex-1 p-10 md:p-16 lg:p-20 text-white space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/30">
                                Contacto Directo
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                                {content.title}
                            </h2>
                            <p className="text-pink-100 text-lg font-medium opacity-90 max-w-md">
                                {content.subtitle}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="space-y-2"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                                        <MapPin size={16} className="text-white" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Visitanos</span>
                                </div>
                                <p className="text-xl font-bold">{content.address}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="space-y-2"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                                        <Phone size={16} className="text-white" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Llamanos</span>
                                </div>
                                <p className="text-xl font-bold">{content.phone}</p>
                            </motion.div>
                        </div>

                        <div className="pt-6 flex flex-wrap gap-4">
                            <motion.a
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                href={`https://wa.me/${content.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                className="bg-white text-pink-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-pink-900/20"
                            >
                                <MessageCircle size={18} /> Escribinos
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                href={`https://instagram.com/${content.instagram.replace('@', '')}`}
                                target="_blank"
                                className="bg-pink-400/30 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-white/20 transition-all"
                            >
                                <Instagram size={18} /> {content.instagram}
                            </motion.a>
                        </div>
                    </div>

                    {/* Visual Content */}
                    <div className="w-full lg:w-[45%] min-h-[400px] relative">
                        <img
                            src={content.image}
                            className="absolute inset-0 w-full h-full object-cover object-center"
                            alt="Contacto Mundo Mágico"
                        />
                        {/* Overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-pink-600/20 hidden lg:block" />
                        <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-white flex items-center gap-4">
                            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500">
                                <ExternalLink size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-pink-500 tracking-widest">Atención 24/7</p>
                                <p className="text-sm font-bold text-gray-900">Consultas Online</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Floating Map Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 relative group"
                >
                    <div className="absolute -inset-4 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-[3.5rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
                    <div className="relative bg-white/80 backdrop-blur-xl p-4 md:p-8 rounded-[3rem] border border-white shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[21/9]">
                        <div className="absolute top-8 left-8 z-10 hidden md:block">
                            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-pink-50 flex items-center gap-4">
                                <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-pink-500 tracking-widest">Ubicación Estratégica</p>
                                    <p className="text-sm font-bold text-gray-900">{content.address}</p>
                                </div>
                            </div>
                        </div>

                        <iframe
                            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105073.23944583271!2d-58.50333831349896!3d-34.61582377045187!2m3!1f0!2f0!3f0!3m2!1i1024!2i1024!4f13.1!3m3!1m2!1s0x95bccac670356703%3A0x2123456789abcdef!2s${encodeURIComponent(content.address)}!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar`}
                            className="w-full h-full rounded-[2rem] border-0 grayscale-[0.2] contrast-[1.1]"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>

                        {/* Decorative Corner Tag */}
                        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-10 px-4 py-2 bg-gray-900/10 backdrop-blur-md rounded-full text-[10px] font-black text-gray-900 uppercase tracking-widest border border-white/20">
                            Interactive View
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactSection;
