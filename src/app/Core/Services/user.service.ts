import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateUserDTO, UpdateUserDTO, User } from '../Interfaces/user.interface';
import { BaseCrudService } from './base-crud.service';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseCrudService<User, CreateUserDTO, UpdateUserDTO> {
  protected readonly baseUrl = `${environment.apiUrl}/users`;
  protected readonly collection = 'users' as const;

  override create(data: CreateUserDTO): Observable<User> {
    if (!environment.useMockApi) return super.create(data);
    const { password, ...userData } = data;
    return super
      .create(userData as CreateUserDTO)
      .pipe(tap((user) => this.store.setCredential(user.email, password)));
  }

  override update(id: string, data: UpdateUserDTO): Observable<User> {
    if (!environment.useMockApi) return super.update(id, data);
    const { password, ...userData } = data;
    return super.update(id, userData).pipe(
      tap((user) => {
        if (password) this.store.setCredential(user.email, password);
      }),
    );
  }
}
