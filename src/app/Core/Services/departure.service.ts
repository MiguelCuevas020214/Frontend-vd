import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  CreateDepartureDTO,
  Departure,
  UpdateDepartureDTO,
} from '../Interfaces/departure.interface';
import { BaseCrudService } from './base-crud.service';

@Injectable({ providedIn: 'root' })
export class DepartureService extends BaseCrudService<
  Departure,
  CreateDepartureDTO,
  UpdateDepartureDTO
> {
  protected readonly baseUrl = `${environment.apiUrl}/departures`;
  protected readonly collection = 'departures' as const;
}
