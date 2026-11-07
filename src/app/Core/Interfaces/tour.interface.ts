export type EntityStatus = 'active' | 'inactive';

export interface TourItineraryDay {
  day: number;
  title: string;
  description: string;
  dateLabel?: string;
  lodging?: string;
  highlights?: string[];
}

export interface Tour {
  id: string;
  name: string;
  destination: string;
  shortDescription: string;
  description: string;
  durationDays: number;
  durationNights: number;
  price: number;
  images: string[];
  itinerary: TourItineraryDay[];
  includes: string[];
  excludes: string[];
  pickupNote?: string;
  importantNotes?: string[];
  category: string;
  featured: boolean;
  status: EntityStatus;
  createdAt: string;
}

export type CreateTourDTO = Omit<Tour, 'id' | 'createdAt'>;
export type UpdateTourDTO = Partial<CreateTourDTO>;
