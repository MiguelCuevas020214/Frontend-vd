import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Booking, CreateBookingDTO, UpdateBookingDTO } from '../Interfaces/booking.interface';
import { BaseCrudService } from './base-crud.service';

@Injectable({ providedIn: 'root' })
export class BookingService extends BaseCrudService<Booking, CreateBookingDTO, UpdateBookingDTO> {
  protected readonly baseUrl = `${environment.apiUrl}/bookings`;
  protected readonly collection = 'bookings' as const;
}
