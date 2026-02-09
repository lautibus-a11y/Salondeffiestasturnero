
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, formatDate } from '../utils';
import { Booking, BookingStatus } from '../types';
import { CheckCircle, XCircle, Clock, Search, Loader2, Users, LayoutDashboard, Utensils, Image as ImageIcon, Sparkles, Save, Plus, Trash2, ChevronRight, Upload } from 'lucide-react';
import { SERVICES, GALLERY_IMAGES } from '../constants';

const ImageUpload = ({ onUpload, label, currentImage }: { onUpload: (url: string) => void, label: string, currentImage?: string }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await db.uploadImage(file);
      onUpload(url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen. Verifica que el bucket 'gallery' existe y es público.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
      <div className="relative group">
        <label className="flex flex-col items-center justify-center w-full h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-white hover:border-pink-200 transition-all group overflow-hidden">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-pink-500" size={24} />
              <span className="text-[8px] font-black uppercase text-gray-400">Subiendo...</span>
            </div>
          ) : currentImage ? (
            <div className="relative w-full h-full">
              <img src={currentImage} className="w-full h-full object-cover" alt="Previa" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <Upload className="text-white" size={20} />
                <span className="text-[8px] font-black uppercase text-white tracking-widest">Cambiar Imagen</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="text-gray-300 group-hover:text-pink-400 transition-colors" size={24} />
              <span className="text-[8px] font-black uppercase text-gray-400 text-center px-4">Subir Archivo<br />(PNG, JPG, WEBP, GIF)</span>
            </div>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>
    </div>
  );
};

type Tab = 'bookings' | 'services' | 'hero' | 'gallery';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Editable content states
  const [services, setServices] = useState<any[]>(SERVICES);
  const [hero, setHero] = useState({ title: 'Donde los sueños cobran vida', description: 'Un espacio sofisticado y alegre diseñado para que cada festejo sea una historia inolvidable.', image: '' });
  const [about, setAbout] = useState({
    image1: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
    image2: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=2070&auto=format&fit=crop'
  });
  const [contact, setContact] = useState({
    title: '¿Tenés alguna duda?',
    subtitle: 'Estamos para ayudarte a que el festejo sea perfecto.',
    address: 'Av. Principal 1234, CABA',
    phone: '+54 9 11 2233 4455',
    instagram: '@mundomagico_salon',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop'
  });
  const [gallery, setGallery] = useState<string[]>(GALLERY_IMAGES);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [bookingsData, servicesData, heroData, galleryData, aboutData, contactData] = await Promise.all([
          db.getBookings(),
          db.getContent('services'),
          db.getContent('hero'),
          db.getContent('gallery'),
          db.getContent('about'),
          db.getContent('contact')
        ]);

        setBookings(bookingsData);
        if (servicesData) setServices(servicesData);
        if (heroData) setHero(heroData);
        if (galleryData) setGallery(galleryData);
        if (aboutData) setAbout(aboutData);
        if (contactData) setContact(contactData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await db.updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error al actualizar el estado.");
    }
  };

  const saveContent = async (key: string, value: any) => {
    setIsSaving(true);
    try {
      await db.updateContent(key, value);
      alert("¡Guardado con éxito!");
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      alert("Error al guardar. Asegúrate que la tabla site_content existe.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await db.deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Error al eliminar la reserva.");
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === 'all' || b.status === filter;
    const matchesSearch = b.date.includes(searchTerm) || b.comments?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const tabIcons = {
    bookings: <Clock size={16} />,
    services: <Utensils size={16} />,
    hero: <Sparkles size={16} />,
    gallery: <ImageIcon size={16} />
  };

  return (
    <div className="pt-32 pb-20 bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Panel de Control</span>
            <h1 className="text-4xl font-black text-black tracking-tight">Administración</h1>
          </div>

          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
            {(['bookings', 'services', 'hero', 'gallery'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                  ? 'bg-black text-white shadow-lg shadow-black/10'
                  : 'text-gray-400 hover:text-black hover:bg-gray-50'
                  }`}
              >
                {tabIcons[tab]}
                <span className="hidden sm:inline">{tab === 'bookings' ? 'Reservas' : tab === 'services' ? 'Servicios' : tab === 'hero' ? 'Contenido' : 'Galería'}</span>
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              {/* Action Bar */}
              <div className="bg-white p-4 rounded-3xl border border-gray-100 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative w-full lg:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar por fecha..."
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-3 pl-10 pr-4 outline-none focus:bg-white focus:border-gray-900 transition-all text-sm font-bold"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
                  {['all', BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CANCELLED].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilter(st as any)}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${filter === st
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'bg-white border-transparent text-gray-400 hover:border-gray-100 hover:text-black'
                        }`}
                    >
                      {st === 'all' ? 'Todos' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Content */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                {isLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="text-sm font-bold uppercase tracking-widest">Cargando datos...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                          <th className="px-8 py-5">Fecha</th>
                          <th className="px-8 py-5">Asistentes</th>
                          <th className="px-8 py-5">Estado</th>
                          <th className="px-8 py-5 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredBookings.length > 0 ? (
                          filteredBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50/30 transition-colors group">
                              <td className="px-8 py-6">
                                <div className="text-sm font-black text-gray-900">{booking.date}</div>
                                <div className="text-[10px] text-pink-400 font-black uppercase mt-0.5 tracking-tighter">{booking.time}</div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                  <Users size={14} className="text-gray-300" />
                                  {booking.kidsCount + booking.adultsCount}
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="relative inline-block w-full min-w-[140px]">
                                  <select
                                    value={booking.status}
                                    onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                                    className={`
                                      appearance-none w-full text-[10px] font-black uppercase tracking-[0.1em] px-4 py-2.5 rounded-xl outline-none border-2 transition-all cursor-pointer
                                      ${booking.status === BookingStatus.CONFIRMED ? 'bg-green-50 border-green-100 text-green-600 focus:border-green-400' :
                                        booking.status === BookingStatus.CANCELLED ? 'bg-red-50 border-red-100 text-red-500 focus:border-red-400' :
                                          'bg-yellow-50 border-yellow-100 text-yellow-600 focus:border-yellow-400'
                                      }
                                    `}
                                  >
                                    <option value={BookingStatus.PENDING}>Pendiente</option>
                                    <option value={BookingStatus.CONFIRMED}>Confirmado</option>
                                    <option value={BookingStatus.CANCELLED}>Cancelado</option>
                                  </select>
                                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 ${booking.status === BookingStatus.CONFIRMED ? 'text-green-600' :
                                    booking.status === BookingStatus.CANCELLED ? 'text-red-500' :
                                      'text-yellow-600'
                                    }`}>
                                    <ChevronRight size={14} className="rotate-90" />
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {booking.status !== BookingStatus.CONFIRMED && (
                                    <button
                                      onClick={() => handleStatusChange(booking.id, BookingStatus.CONFIRMED)}
                                      className="p-2.5 bg-green-50 text-green-500 rounded-xl hover:bg-green-100 transition-colors shadow-sm"
                                      title="Confirmar"
                                    >
                                      <CheckCircle size={18} />
                                    </button>
                                  )}
                                  {booking.status !== BookingStatus.CANCELLED && (
                                    <button
                                      onClick={() => handleStatusChange(booking.id, BookingStatus.CANCELLED)}
                                      className="p-2.5 bg-red-50 text-red-400 rounded-xl hover:bg-red-100 transition-colors shadow-sm"
                                      title="Cancelar"
                                    >
                                      <XCircle size={18} />
                                    </button>
                                  )}
                                  {booking.status !== BookingStatus.PENDING && (
                                    <button
                                      onClick={() => handleStatusChange(booking.id, BookingStatus.PENDING)}
                                      className="p-2.5 bg-yellow-50 text-yellow-500 rounded-xl hover:bg-yellow-100 transition-colors shadow-sm"
                                      title="Volver a Pendiente"
                                    >
                                      <Clock size={18} />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteBooking(booking.id)}
                                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                    title="Eliminar Permanente"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-8 py-32 text-center text-gray-300 text-sm font-bold uppercase tracking-widest">No se encontraron registros</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm max-w-2xl"
            >
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título Hero</label>
                  <textarea
                    value={hero.title}
                    onChange={(e) => setHero({ ...hero, title: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-6 outline-none focus:bg-white focus:border-pink-200 transition-all text-2xl font-black text-gray-900 resize-none"
                  />
                </div>
                <div className="space-y-3">
                  <ImageUpload
                    label="Imagen Hero Principal"
                    currentImage={hero.image}
                    onUpload={(url) => setHero({ ...hero, image: url })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descripción</label>
                  <textarea
                    value={hero.description}
                    onChange={(e) => setHero({ ...hero, description: e.target.value })}
                    rows={4}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-6 outline-none focus:bg-white focus:border-pink-200 transition-all text-sm font-medium text-gray-500 resize-none"
                  />
                </div>
                <button
                  onClick={() => saveContent('hero', hero)}
                  disabled={isSaving}
                  className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-black/10 transition-all disabled:opacity-50"
                >
                  <Save size={18} /> {isSaving ? 'Guardando...' : 'Guardar Cambios Hero'}
                </button>

                <div className="pt-10 border-t border-gray-100 space-y-8">
                  <header>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Fotos Sección Historia</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Imágenes de la sección "Nuestra Historia"</p>
                  </header>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ImageUpload
                      label="Imagen 1 (Superior)"
                      currentImage={about.image1}
                      onUpload={(url) => setAbout({ ...about, image1: url })}
                    />
                    <ImageUpload
                      label="Imagen 2 (Inferior)"
                      currentImage={about.image2}
                      onUpload={(url) => setAbout({ ...about, image2: url })}
                    />
                  </div>

                  <button
                    onClick={() => saveContent('about', about)}
                    disabled={isSaving}
                    className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-black/10 transition-all disabled:opacity-50"
                  >
                    <Save size={18} /> {isSaving ? 'Guardando...' : 'Guardar Fotos Historia'}
                  </button>
                </div>

                <div className="pt-10 border-t border-gray-100 space-y-8">
                  <header>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Sección de Contacto</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configuración del banner de contacto</p>
                  </header>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título</label>
                        <input
                          value={contact.title}
                          onChange={(e) => setContact({ ...contact, title: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 outline-none focus:bg-white focus:border-pink-200 transition-all text-sm font-bold"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subtítulo</label>
                        <input
                          value={contact.subtitle}
                          onChange={(e) => setContact({ ...contact, subtitle: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 outline-none focus:bg-white focus:border-pink-200 transition-all text-sm font-medium text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dirección</label>
                        <input
                          value={contact.address}
                          onChange={(e) => setContact({ ...contact, address: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 outline-none focus:bg-white focus:border-pink-200 transition-all text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Teléfono</label>
                        <input
                          value={contact.phone}
                          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 outline-none focus:bg-white focus:border-pink-200 transition-all text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Instagram</label>
                        <input
                          value={contact.instagram}
                          onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 outline-none focus:bg-white focus:border-pink-200 transition-all text-xs font-bold"
                        />
                      </div>
                    </div>

                    <ImageUpload
                      label="Imagen Lateral de Contacto"
                      currentImage={contact.image}
                      onUpload={(url) => setContact({ ...contact, image: url })}
                    />
                  </div>

                  <button
                    onClick={() => saveContent('contact', contact)}
                    disabled={isSaving}
                    className="flex items-center gap-3 bg-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-pink-100 transition-all disabled:opacity-50"
                  >
                    <Save size={18} /> {isSaving ? 'Guardando...' : 'Guardar Configuración Contacto'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2 flex-grow">
                        <label className="text-[8px] font-black uppercase text-gray-400">Emoji / Icono</label>
                        <input
                          value={service.icon}
                          onChange={(e) => {
                            const newServices = [...services];
                            newServices[idx].icon = e.target.value;
                            setServices(newServices);
                          }}
                          className="text-2xl bg-gray-50 w-full h-14 rounded-2xl p-4 outline-none focus:bg-white border-2 border-transparent focus:border-pink-100 transition-all font-bold"
                        />
                      </div>
                      <button
                        onClick={() => setServices(services.filter((_, i) => i !== idx))}
                        className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all mt-6"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-gray-400">Título</label>
                        <input
                          value={service.title}
                          onChange={(e) => {
                            const newServices = [...services];
                            newServices[idx].title = e.target.value;
                            setServices(newServices);
                          }}
                          className="w-full text-xl font-black text-gray-900 bg-transparent border-b border-dashed border-gray-100 focus:border-pink-200 outline-none pb-2 transition-all"
                          placeholder="Título"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-gray-400">Descripción</label>
                        <textarea
                          value={service.description}
                          onChange={(e) => {
                            const newServices = [...services];
                            newServices[idx].description = e.target.value;
                            setServices(newServices);
                          }}
                          rows={3}
                          className="w-full text-sm font-medium text-gray-400 bg-transparent outline-none resize-none"
                          placeholder="Descripción..."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setServices([...services, { title: '', description: '', icon: '✨' }])}
                  className="bg-dashed-border h-[280px] rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-pink-200 hover:text-pink-400 transition-all group"
                >
                  <div className="p-4 bg-gray-50 rounded-full group-hover:bg-pink-50 transition-all">
                    <Plus size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Añadir Servicio</span>
                </button>
              </div>

              <div className="flex justify-center pt-8">
                <button
                  onClick={() => saveContent('services', services)}
                  disabled={isSaving}
                  className="flex items-center gap-3 bg-black text-white px-12 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:shadow-2xl hover:shadow-black/20 transition-all disabled:opacity-50"
                >
                  <Save size={18} /> {isSaving ? 'Guardar Todos los Servicios' : 'Guardar Todos los Servicios'}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.map((img, idx) => (
                  <div key={idx} className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
                    <img src={img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-4">
                      <button
                        onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                        className="p-3 bg-red-500 text-white rounded-xl hover:scale-110 transition-all shadow-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                <ImageUpload
                  label="Añadir a Galería"
                  onUpload={(url) => setGallery([...gallery, url])}
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => saveContent('gallery', gallery)}
                  disabled={isSaving}
                  className="flex items-center gap-3 bg-black text-white px-12 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:shadow-2xl hover:shadow-black/20 transition-all disabled:opacity-50"
                >
                  <Save size={18} /> {isSaving ? 'Guardar Galería' : 'Guardar Galería'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPanel;
