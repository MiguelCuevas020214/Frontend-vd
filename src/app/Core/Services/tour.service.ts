import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CreateTourDTO, Tour, UpdateTourDTO } from '../Interfaces/tour.interface';
import { BaseCrudService } from './base-crud.service';

@Injectable({ providedIn: 'root' })
export class TourService extends BaseCrudService<Tour, CreateTourDTO, UpdateTourDTO> {
  protected readonly baseUrl = `${environment.apiUrl}/tours`;
  protected readonly collection = 'tours' as const;
}
