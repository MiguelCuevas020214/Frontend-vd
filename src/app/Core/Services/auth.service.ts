import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { delay, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginDTO, User } from '../Interfaces/user.interface';
import { DemoStoreService } from './demo-store.service';

const TOKEN_KEY = 'viaje-directo-token';
const USER_KEY = 'viaje-directo-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private readonly http = inject(HttpClient);
  private readonly store = inject(DemoStoreService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly token = signal<string | null>(this.readStorage(TOKEN_KEY));
  private readonly currentUser = signal<User | null>(this.restoreUser());

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.token() && !!this.currentUser());
  readonly isOwner = computed(() => this.currentUser()?.role === 'owner');

  login(credentials: LoginDTO): Observable<AuthResponse> {
    if (!environment.useMockApi) {
      return this.http
        .post<AuthResponse>(`${this.baseUrl}/login`, credentials)
        .pipe(tap((response) => this.saveSession(response)));
    }

    const state = this.store.snapshot();
    const user = state.users.find(
      (entry) => entry.email.toLowerCase() === credentials.email.trim().toLowerCase(),
    );
    if (!user || !user.active || state.credentials[user.email] !== credentials.password) {
      return throwError(() => new Error('El correo o la contraseña no son correctos.')).pipe(
        delay(450),
      );
    }
    return of({ token: `demo-${user.id}-${Date.now()}`, user }).pipe(
      delay(450),
      tap((response) => this.saveSession(response)),
    );
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  getToken(): string | null {
    return this.token();
  }

  private saveSession(response: AuthResponse): void {
    this.token.set(response.token);
    this.currentUser.set(response.user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
  }

  private restoreUser(): User | null {
    const value = this.readStorage(USER_KEY);
    if (!value) return null;
    try {
      return JSON.parse(value) as User;
    } catch {
      return null;
    }
  }

  private readStorage(key: string): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(key) : null;
  }
}
