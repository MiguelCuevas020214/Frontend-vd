import { EntityStatus } from './tour.interface';

export interface TravelPackage {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  days: number;
  destinations: string[];
  pricePerPerson: number;
  image: string;
  startDate: string;
  endDate: string;
  featured: boolean;
  status: EntityStatus;
  createdAt: string;
}

export type CreatePackageDTO = Omit<TravelPackage, 'id' | 'createdAt'>;
export type UpdatePackageDTO = Partial<CreatePackageDTO>;
