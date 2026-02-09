
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Users, MessageSquare, CheckCircle, ExternalLink, Plus, Minus, Loader2 } from 'lucide-react';
import { TIME_SLOTS } from '../constants';
import { db, generateWhatsAppLink, formatDate } from '../utils';
import { Booking, BookingStatus } from '../types';

const NumberInput: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  onChange: (val: number) => void;
  color: string;
}> = ({ label, value, icon, onChange, color }) => (
  <div className={`bg-${color}-50/50 p-6 rounded-[2rem] border border-${color}-100 transition-all hover:shadow-md hover:shadow-${color}-100/20`}>
    <label className={`flex items-center gap-2 text-${color}-400 font-black mb-5 text-[10px] uppercase tracking-widest block`}>
      {icon} {label}
    </label>
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-12 h-12 rounded-[1rem] bg-white border border-gray-100 text-gray-400 flex items-center justify-center hover:text-pink-500 hover:border-pink-200 transition-all shadow-sm active:scale-90"
      >
        <Minus size={20} />
      </button>
      <span className="text-3xl font-black text-gray-800">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(100, value + 1))}
        className="w-12 h-12 rounded-[1rem] bg-white border border-gray-100 text-gray-400 flex items-center justify-center hover:text-pink-500 hover:border-pink-200 transition-all shadow-sm active:scale-90"
      >
        <Plus size={20} />
      </button>
    </div>
  </div>
);

const BookingSection: React.FC = () => {
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: getTodayDate(),
    time: '',
    kidsCount: 20,
    adultsCount: 20,
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);

  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleDateClick = (value: string) => {
    if (value === 'custom') {
      try {
        dateInputRef.current?.showPicker();
      } catch (e) {
        dateInputRef.current?.focus();
        dateInputRef.current?.click();
      }
    } else {
      setFormData({ ...formData, date: value });
    }
  };

  const fetchAvailability = async (selectedDate: string) => {
    if (!selectedDate) return;
    try {
      const bookings = await db.getBookings();
      const taken = bookings
        .filter(b =>
          b.date === selectedDate &&
          b.status !== BookingStatus.CANCELLED &&
          b.status !== ('cancelado' as BookingStatus)
        )
        .map(b => b.time);

      setOccupiedSlots(taken);

      // Clear selected time if it becomes occupied
      if (taken.includes(formData.time)) {
        setFormData(prev => ({ ...prev, time: '' }));
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  React.useEffect(() => {
    fetchAvailability(formData.date);

    // Refresh when tab becomes visible or gets focus to stay in sync with admin changes
    const handleSync = () => fetchAvailability(formData.date);
    window.addEventListener('focus', handleSync);
    window.addEventListener('visibilitychange', handleSync);

    return () => {
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('visibilitychange', handleSync);
    };
  }, [formData.date]);

  const sectionRef = React.useRef<HTMLElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time) {
      alert("Por favor selecciona un horario disponible.");
      return;
    }
    setIsSubmitting(true);
    try {
      const bookingData: Partial<Booking> = {
        ...formData,
        status: BookingStatus.PENDING,
      };

      const savedBooking = await db.saveBooking(bookingData);
      setSuccessBooking(savedBooking);

      // Scroll smoothly to the top of the section to show the success message
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      alert("Hubo un error al procesar tu reserva. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSuccessBooking(null);
    setFormData({ date: '', time: '', kidsCount: 20, adultsCount: 20, comments: '' });
  };

  return (
    <section ref={sectionRef} id="reserva" className="py-20 md:py-32 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-blue-50/20 scroll-mt-20 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-pink-200/30 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-pink-200/40 border-2 border-pink-100 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!successBooking ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 md:p-16"
              >
                <div className="text-center mb-16">
                  <div className="inline-block px-4 py-1.5 bg-pink-50 text-pink-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    Turnero Online
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Reserva tu fecha</h2>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto font-medium">
                    Consulta disponibilidad de forma instantánea. ¡Es simple y rápido!
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-gray-400 font-black text-[10px] uppercase tracking-widest ml-1 block">Día del evento</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { label: 'Hoy', value: getTodayDate() },
                          { label: 'Mañana', value: getTomorrowDate() },
                          { label: 'Otro día', value: 'custom' }
                        ].map((day) => {
                          const isSelected = day.value === 'custom' ?
                            (formData.date !== getTodayDate() && formData.date !== getTomorrowDate()) :
                            formData.date === day.value;

                          return (
                            <button
                              key={day.label}
                              type="button"
                              onClick={() => handleDateClick(day.value)}
                              className={`
                                relative p-4 rounded-2xl text-sm font-bold transition-all border-2
                                ${isSelected
                                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-transparent text-white shadow-lg shadow-pink-100'
                                  : 'bg-white border-gray-100 text-gray-600 hover:border-pink-200'
                                }
                                ${day.value === 'custom' ? 'overflow-hidden' : ''}
                              `}
                            >
                              <span className="relative z-10">{day.label}</span>
                              {day.value === 'custom' && (
                                <input
                                  ref={dateInputRef}
                                  type="date"
                                  min={getTodayDate()}
                                  value={formData.date}
                                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                  className="absolute inset-0 opacity-0 cursor-pointer z-0"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {formData.date && (
                        <p className="text-xs font-bold text-pink-500 ml-1">
                          Viendo disponibilidad para: <span className="capitalize">{formatDate(formData.date)}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <label className="text-gray-400 font-black text-[10px] uppercase tracking-widest ml-1 block">Franja horaria</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {TIME_SLOTS.map((slot) => {
                          const isOccupied = occupiedSlots.includes(slot);
                          const isSelected = formData.time === slot;

                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isOccupied}
                              onClick={() => setFormData({ ...formData, time: slot })}
                              className={`
                                relative p-4 rounded-2xl text-sm font-bold transition-all border-2 overflow-hidden
                                ${isOccupied
                                  ? 'bg-gray-50 border-transparent text-gray-300 cursor-not-allowed opacity-60'
                                  : isSelected
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-transparent text-white shadow-lg shadow-pink-100'
                                    : 'bg-white border-gray-100 text-gray-600 hover:border-pink-200 hover:text-pink-500'
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <span className="relative z-10">{slot}</span>
                                {isOccupied && <span className="text-[10px] font-black uppercase tracking-widest text-pink-500/60 relative z-10">Ocupado</span>}
                              </div>

                              {/* Team Color Cross for occupied slots */}
                              {isOccupied && (
                                <div className="absolute inset-0 pointer-events-none">
                                  <svg className="w-full h-full opacity-60">
                                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="url(#crossGradient)" strokeWidth="3" />
                                    <line x1="100%" y1="0" x2="0" y2="100%" stroke="url(#crossGradient)" strokeWidth="3" />
                                    <defs>
                                      <linearGradient id="crossGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#ec4899" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NumberInput label="Niños Invitados" value={formData.kidsCount} icon={<Users size={12} />} onChange={(val) => setFormData({ ...formData, kidsCount: val })} color="pink" />
                    <NumberInput label="Adultos" value={formData.adultsCount} icon={<Users size={12} />} onChange={(val) => setFormData({ ...formData, adultsCount: val })} color="blue" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-gray-400 font-bold text-[10px] uppercase tracking-widest ml-1">Notas especiales</label>
                    <textarea
                      rows={3}
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      placeholder="Indique temática, catering o dudas..."
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-5 outline-none focus:bg-white focus:border-pink-200 transition-all text-sm font-medium text-gray-600 resize-none"
                    ></textarea>
                  </div>

                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-base py-6 rounded-[1.5rem] shadow-[0_15px_30px_rgba(236,72,153,0.3)] flex items-center justify-center gap-4 tracking-widest uppercase transition-all active:shadow-none"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : 'Confirmar Reserva'}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 md:p-20 text-center space-y-10"
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
                  className="w-20 h-20 bg-green-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-green-100"
                >
                  <CheckCircle size={40} />
                </motion.div>

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">¡Reserva enviada con éxito!</h2>
                  <p className="text-gray-400 text-sm font-medium">Confirme su asistencia por WhatsApp para finalizar.</p>
                </div>

                <div className="bg-pink-50/50 p-8 rounded-[2rem] border border-pink-100 text-left space-y-4 max-w-sm mx-auto shadow-inner">
                  <div className="flex justify-between items-end border-b border-pink-100 pb-3">
                    <span className="text-[10px] uppercase font-black text-pink-300 tracking-widest">Día Elegido</span>
                    <span className="text-sm font-bold text-gray-700">{formatDate(successBooking.date)}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase font-black text-pink-300 tracking-widest">Total Invitados</span>
                    <span className="text-sm font-bold text-gray-700">{successBooking.kidsCount + successBooking.adultsCount} personas</span>
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    href={generateWhatsAppLink(successBooking, '5491122334455')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white font-bold text-sm py-5 rounded-2xl shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-3 max-w-sm mx-auto uppercase tracking-widest"
                  >
                    Confirmar vía WhatsApp <ExternalLink size={18} />
                  </motion.a>
                  <button onClick={resetForm} className="text-pink-400 hover:text-pink-600 text-xs font-bold uppercase tracking-widest transition-colors">Modificar reserva</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingSection;
