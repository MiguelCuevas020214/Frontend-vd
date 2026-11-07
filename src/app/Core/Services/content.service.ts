import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SiteContent, UpdateContentDTO } from '../Interfaces/content.interface';
import { DemoStoreService } from './demo-store.service';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly baseUrl = `${environment.apiUrl}/content`;
  private readonly http = inject(HttpClient);
  private readonly store = inject(DemoStoreService);

  get(): Observable<SiteContent> {
    return environment.useMockApi
      ? of(this.store.snapshot().content).pipe(delay(100))
      : this.http.get<SiteContent>(this.baseUrl);
  }

  update(data: UpdateContentDTO): Observable<SiteContent> {
    return environment.useMockApi
      ? this.store.updateContent(data)
      : this.http.patch<SiteContent>(this.baseUrl, data);
  }
}
