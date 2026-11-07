import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TravelPackage } from '../../../../Core/Interfaces/package.interface';
import { PackageService } from '../../../../Core/Services/package.service';
import { ToastService } from '../../../../Core/Services/toast.service';
import { formatDate, formatPrice, getErrorMessage } from '../../../../Core/Utils/format.utils';
import { ButtonComponent } from '../../../../Shared/Components/home-components/Buttons/button/button';

@Component({
  selector: 'app-package-detail-view',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './detail-view.html',
  styleUrl: './detail-view.css',
})
export class PackageDetailViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly packageService = inject(PackageService);
  private readonly toast = inject(ToastService);
  readonly item = signal<TravelPackage | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.packageService.getById(this.route.snapshot.paramMap.get('id') ?? '').subscribe({
      next: (item) => {
        this.item.set(item);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.toast.error(getErrorMessage(error));
      },
    });
  }
  price(value: number): string {
    return formatPrice(value);
  }
  date(value: string): string {
    return formatDate(value);
  }
  consult(): void {
    const name = this.item()?.name ?? 'sus paquetes';
    const text = encodeURIComponent(
      `Hola Viaje Directo, quiero información sobre el paquete "${name}".`,
    );
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/529992346604?text=${text}`, '_blank', 'noopener');
    }
  }
}
