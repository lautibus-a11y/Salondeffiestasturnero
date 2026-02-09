
export enum BookingStatus {
  PENDING = 'pendiente',
  CONFIRMED = 'confirmado',
  CANCELLED = 'cancelado'
}

export interface Booking {
  id: string;
  date: string;
  time: string;
  kidsCount: number;
  adultsCount: number;
  comments?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface SiteConfig {
  maxCapacity: number;
  blockedDates: string[];
  whatsAppNumber: string;
}
