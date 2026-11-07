import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../Core/Services/auth.service';
import { ToastService } from '../../Core/Services/toast.service';
import { ButtonSidebarComponent } from '../../Shared/Components/home-components/Buttons/button-sidebar/button-sidebar';

interface PanelNavItem {
  label: string;
  icon: string;
  path: string;
  title: string;
}

@Component({
  selector: 'app-panel-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ButtonSidebarComponent],
  templateUrl: './panel-layout.html',
  styleUrl: './panel-layout.css',
})
export class PanelLayoutComponent {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  readonly auth = inject(AuthService);
  readonly sidebarOpen = signal(false);
  readonly currentPath = signal(this.router.url);
  private readonly items: PanelNavItem[] = [
    { label: 'HOME', icon: '⌂', path: '/panel', title: 'Contenido del home' },
    { label: 'TOURS', icon: '⌖', path: '/panel/tours', title: 'Gestión de tours' },
    { label: 'CALENDARIO', icon: '□', path: '/panel/calendario', title: 'Calendario de salidas' },
    { label: 'NOSOTROS', icon: '♡', path: '/panel/nosotros', title: 'Sección nosotros' },
    { label: 'USUARIOS', icon: '♙', path: '/panel/usuarios', title: 'Gestión de usuarios' },
  ];
  readonly navItems = computed(() =>
    this.items.filter((item) => item.path !== '/panel/usuarios' || this.auth.isOwner()),
  );
  readonly pageTitle = computed(() => {
    const path = this.currentPath();
    return (
      [...this.items]
        .reverse()
        .find((item) => (item.path === '/panel' ? path === '/panel' : path.startsWith(item.path)))
        ?.title ?? 'Panel de gestión'
    );
  });

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.currentPath.set(this.router.url);
        this.sidebarOpen.set(false);
      });
  }

  isActive(path: string): boolean {
    return path === '/panel'
      ? this.currentPath() === '/panel'
      : this.currentPath().startsWith(path);
  }

  navigate(path: string): void {
    void this.router.navigate([path]);
  }

  logout(): void {
    this.auth.logout();
    this.toast.show('Tu sesión se cerró correctamente.', 'info');
    void this.router.navigate(['/login']);
  }
}
