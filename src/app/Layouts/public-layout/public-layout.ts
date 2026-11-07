import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayoutComponent {
  menuOpen = false;
  readonly year = new Date().getFullYear();
  readonly whatsappUrl =
    'https://wa.me/529992346604?text=Hola%20Viaje%20Directo%2C%20quiero%20informaci%C3%B3n%20sobre%20sus%20tours.';
  readonly instagramUrl = 'https://www.instagram.com/viajedirectomx/';
  readonly facebookUrl = 'https://www.facebook.com/ViajeDirecto.MX';
  readonly email = 'viajedirecto.vlogs@gmail.com';
  readonly phoneDisplay = '999 234 6604';
  readonly phoneHref = 'tel:+529992346604';
  readonly address = 'Calle 21 x40 y 42 Los Reyes, Mérida, México, 97156';
  readonly mapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Calle+21+x40+y+42+Los+Reyes+Merida+Mexico+97156';
  private readonly router = inject(Router);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => (this.menuOpen = false));
  }
}
