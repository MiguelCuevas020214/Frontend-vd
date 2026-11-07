import { EntityStatus } from './tour.interface';

export interface Departure {
  id: string;
  productType: 'tour' | 'package';
  productId: string;
  date: string;
  totalSlots: number;
  availableSlots: number;
  price: number;
  status: EntityStatus;
  createdAt: string;
}

export type CreateDepartureDTO = Omit<Departure, 'id' | 'createdAt'>;
export type UpdateDepartureDTO = Partial<CreateDepartureDTO>;

export interface DepartureWithProduct extends Departure {
  productName: string;
  destination: string;
  image: string;
}
