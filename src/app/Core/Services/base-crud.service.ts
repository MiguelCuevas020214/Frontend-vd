import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CollectionKey, DemoStoreService } from './demo-store.service';

export abstract class BaseCrudService<
  T extends { id: string; createdAt: string },
  CreateDTO,
  UpdateDTO,
> {
  protected abstract readonly baseUrl: string;
  protected abstract readonly collection: CollectionKey;
  protected readonly http = inject(HttpClient);
  protected readonly store = inject(DemoStoreService);

  create(data: CreateDTO): Observable<T> {
    if (environment.useMockApi) {
      return this.store.insert<T>(this.collection, data as unknown as Omit<T, 'id' | 'createdAt'>);
    }
    return this.http.post<T>(this.baseUrl, data);
  }

  get(): Observable<T[]> {
    return environment.useMockApi
      ? (this.store.select(this.collection) as unknown as Observable<T[]>)
      : this.http.get<T[]>(this.baseUrl);
  }

  getById(id: string): Observable<T> {
    return environment.useMockApi
      ? this.store.getById<T>(this.collection, id)
      : this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  update(id: string, data: UpdateDTO): Observable<T> {
    if (environment.useMockApi) {
      return this.store.update<T>(
        this.collection,
        id,
        data as unknown as Partial<Omit<T, 'id' | 'createdAt'>>,
      );
    }
    return this.http.patch<T>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return environment.useMockApi
      ? this.store.remove(this.collection, id)
      : this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(map(() => void 0));
  }
}
