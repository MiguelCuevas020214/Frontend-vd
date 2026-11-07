import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Booking } from '../Interfaces/booking.interface';
import { SiteContent } from '../Interfaces/content.interface';
import { Departure } from '../Interfaces/departure.interface';
import { TravelPackage } from '../Interfaces/package.interface';
import { Tour } from '../Interfaces/tour.interface';
import { User } from '../Interfaces/user.interface';
import {
  demoBookings,
  demoContent,
  demoDepartures,
  demoPackages,
  demoTours,
  demoUsers,
} from '../Utils/demo-data';

export interface DemoState {
  tours: Tour[];
  packages: TravelPackage[];
  departures: Departure[];
  users: User[];
  bookings: Booking[];
  content: SiteContent;
  credentials: Record<string, string>;
}

export type CollectionKey = 'tours' | 'packages' | 'departures' | 'users' | 'bookings';
type Entity = { id: string; createdAt: string };

const STORAGE_KEY = 'viaje-directo-demo-v5';
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const initialState = (): DemoState => ({
  tours: clone(demoTours),
  packages: clone(demoPackages),
  departures: clone(demoDepartures),
  users: clone(demoUsers),
  bookings: clone(demoBookings),
  content: clone(demoContent),
  credentials: {
    'owner@viajedirecto.com': 'Admin123*',
    'editor@viajedirecto.com': 'Editor123*',
    'lucia@viajedirecto.com': 'Editor123*',
  },
});

@Injectable({ providedIn: 'root' })
export class DemoStoreService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly state = signal<DemoState>(this.load());

  snapshot(): DemoState {
    return clone(this.state());
  }

  select<K extends CollectionKey>(key: K): Observable<DemoState[K]> {
    return of(clone(this.state()[key])).pipe(delay(100));
  }

  getById<T extends Entity>(key: CollectionKey, id: string): Observable<T> {
    const item = (this.state()[key] as unknown as T[]).find((entry) => entry.id === id);
    return item
      ? of(clone(item)).pipe(delay(80))
      : throwError(() => new Error('No encontramos el elemento solicitado.')).pipe(delay(80));
  }

  insert<T extends Entity>(key: CollectionKey, data: Omit<T, 'id' | 'createdAt'>): Observable<T> {
    const item = {
      ...clone(data),
      id: `${key}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    } as unknown as T;
    this.mutate((state) => ({
      ...state,
      [key]: [...(state[key] as unknown as T[]), item],
    }));
    return of(clone(item)).pipe(delay(250));
  }

  update<T extends Entity>(
    key: CollectionKey,
    id: string,
    changes: Partial<Omit<T, 'id' | 'createdAt'>>,
  ): Observable<T> {
    let updated: T | undefined;
    this.mutate((state) => ({
      ...state,
      [key]: (state[key] as unknown as T[]).map((item) => {
        if (item.id !== id) return item;
        updated = { ...item, ...clone(changes), id: item.id, createdAt: item.createdAt };
        return updated;
      }),
    }));
    return updated
      ? of(clone(updated)).pipe(delay(250))
      : throwError(() => new Error('El elemento ya no existe.')).pipe(delay(250));
  }

  remove(key: CollectionKey, id: string): Observable<void> {
    this.mutate((state) => ({
      ...state,
      [key]: (state[key] as unknown as Entity[]).filter((item) => item.id !== id),
    }));
    return of(void 0).pipe(delay(250));
  }

  updateContent(changes: Partial<SiteContent>): Observable<SiteContent> {
    this.mutate((state) => ({
      ...state,
      content: {
        home: { ...state.content.home, ...changes.home },
        about: { ...state.content.about, ...changes.about },
      },
    }));
    return of(clone(this.state().content)).pipe(delay(250));
  }

  setCredential(email: string, password: string): void {
    this.mutate((state) => ({
      ...state,
      credentials: { ...state.credentials, [email]: password },
    }));
  }

  private load(): DemoState {
    if (!isPlatformBrowser(this.platformId)) return initialState();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as DemoState) : initialState();
    } catch {
      return initialState();
    }
  }

  private mutate(updater: (state: DemoState) => DemoState): void {
    this.state.update(updater);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
    }
  }
}
