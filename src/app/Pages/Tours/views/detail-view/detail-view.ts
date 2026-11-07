import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Departure } from '../../../../Core/Interfaces/departure.interface';
import { Tour } from '../../../../Core/Interfaces/tour.interface';
import { DepartureService } from '../../../../Core/Services/departure.service';
import { ToastService } from '../../../../Core/Services/toast.service';
import { TourService } from '../../../../Core/Services/tour.service';
import { formatDate, formatPrice, getErrorMessage } from '../../../../Core/Utils/format.utils';
import { isExpressTour } from '../../../../Core/Utils/tour.utils';
import { ButtonComponent } from '../../../../Shared/Components/home-components/Buttons/button/button';
import { StatusBadgeComponent } from '../../../../Shared/Components/home-components/Badges/status-badge/status-badge';

@Component({
  selector: 'app-tour-detail-view',
  standalone: true,
  imports: [RouterLink, ButtonComponent, StatusBadgeComponent],
  templateUrl: './detail-view.html',
  styleUrl: './detail-view.css',
})
export class TourDetailViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tourService = inject(TourService);
  private readonly departureService = inject(DepartureService);
  private readonly toast = inject(ToastService);
  readonly tour = signal<Tour | null>(null);
  readonly departures = signal<Departure[]>([]);
  readonly loading = signal(true);
  readonly selectedImage = signal(0);
  readonly isExpress = computed(() => (this.tour() ? isExpressTour(this.tour()!) : false));

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      tour: this.tourService.getById(id),
      departures: this.departureService.get(),
    }).subscribe({
      next: ({ tour, departures }) => {
        this.tour.set(tour);
        this.departures.set(
          departures
            .filter(
              (item) =>
                item.productType === 'tour' && item.productId === id && item.status === 'active',
            )
            .sort((a, b) => a.date.localeCompare(b.date)),
        );
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
    return formatDate(value, { weekday: 'short', day: 'numeric', month: 'short' });
  }
  consult(): void {
    const name = this.tour()?.name ?? 'sus tours';
    const text = encodeURIComponent(
      `Hola Viaje Directo, quiero información sobre el tour "${name}".`,
    );
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/529992346604?text=${text}`, '_blank', 'noopener');
    }
  }
}
