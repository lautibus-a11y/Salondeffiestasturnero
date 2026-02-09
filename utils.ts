
import { Booking, BookingStatus } from './types';
import { supabase } from './lib/supabase/supabaseClient';

export const generateWhatsAppLink = (booking: Booking, phone: string): string => {
  const message = `Hola! Quiero confirmar mi reserva:\n\n📅 Fecha: ${booking.date}\n⏰ Horario: ${booking.time}\n👦 Niños: ${booking.kidsCount}\n👨 Adultos: ${booking.adultsCount}${booking.comments ? `\n💬 Comentarios: ${booking.comments}` : ''}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

export const formatDate = (dateStr: string): string => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  // Adding T12:00:00 to avoid timezone shifts that can change the day
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-ES', options);
};

// Helpers para mapear entre la base de datos (snake_case) y el frontend (camelCase)
const mapDbToBooking = (dbRow: any): Booking => ({
  id: dbRow.id,
  date: dbRow.date,
  time: dbRow.time,
  kidsCount: dbRow.kids_count,
  adultsCount: dbRow.adults_count,
  comments: dbRow.comments,
  status: dbRow.status as BookingStatus,
  createdAt: dbRow.created_at
});

const mapBookingToDb = (booking: Partial<Booking>) => ({
  date: booking.date,
  time: booking.time,
  kids_count: booking.kidsCount,
  adults_count: booking.adultsCount,
  comments: booking.comments,
  status: booking.status
});

export const db = {
  getBookings: async (): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
    return data.map(mapDbToBooking);
  },

  // Fixed the syntax for saveBooking: corrected the parameter type and added missing arrow function syntax
  saveBooking: async (booking: Partial<Booking>): Promise<Booking> => {
    const dbData = mapBookingToDb(booking);
    const { data, error } = await supabase
      .from('bookings')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      throw error;
    }
    return mapDbToBooking(data);
  },

  updateBookingStatus: async (id: string, status: BookingStatus) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  deleteBooking: async (id: string) => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  getContent: async (key: string): Promise<any> => {
    const { data, error } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      console.warn(`Content for ${key} not found in DB, using fallback.`);
      return null;
    }
    return data.value;
  },

  updateContent: async (key: string, value: any) => {
    const { error } = await supabase
      .from('site_content')
      .upsert({ key, value, updated_at: new Date() });

    if (error) throw error;
  },

  uploadImage: async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
