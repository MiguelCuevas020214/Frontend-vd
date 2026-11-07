import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CreatePackageDTO, TravelPackage, UpdatePackageDTO } from '../Interfaces/package.interface';
import { BaseCrudService } from './base-crud.service';

@Injectable({ providedIn: 'root' })
export class PackageService extends BaseCrudService<
  TravelPackage,
  CreatePackageDTO,
  UpdatePackageDTO
> {
  protected readonly baseUrl = `${environment.apiUrl}/packages`;
  protected readonly collection = 'packages' as const;
}
