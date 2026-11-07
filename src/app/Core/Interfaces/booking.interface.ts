export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  departureId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelers: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
}

export type CreateBookingDTO = Omit<Booking, 'id' | 'createdAt'>;
export type UpdateBookingDTO = Partial<CreateBookingDTO>;
