import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Tour } from '../../../../Core/Interfaces/tour.interface';
import { ToastService } from '../../../../Core/Services/toast.service';
import { TourService } from '../../../../Core/Services/tour.service';
import { formatPrice, getErrorMessage } from '../../../../Core/Utils/format.utils';
import { isExpressTour } from '../../../../Core/Utils/tour.utils';
import { ButtonComponent } from '../../../../Shared/Components/home-components/Buttons/button/button';
import { DynamicCardComponent } from '../../../../Shared/Components/home-components/Cards/dynamic-card/dynamic-card';

@Component({
  selector: 'app-express-view',
  standalone: true,
  imports: [RouterLink, ButtonComponent, DynamicCardComponent],
  templateUrl: './express-view.html',
  styleUrl: './express-view.css',
})
export class ExpressViewComponent implements OnInit {
  private readonly tourService = inject(TourService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  readonly tours = signal<Tour[]>([]);
  readonly loading = signal(true);
  readonly expressTours = computed(() =>
    this.tours().filter((tour) => tour.status === 'active' && isExpressTour(tour)),
  );

  ngOnInit(): void {
    this.tourService.get().subscribe({
      next: (tours) => {
        this.tours.set(tours);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.toast.error(getErrorMessage(error));
      },
    });
  }

  nights(tour: Tour): string {
    return tour.durationNights === 1 ? '1 noche' : `${tour.durationNights} noches`;
  }

  price(value: number): string {
    return formatPrice(value);
  }

  goTours(): void {
    void this.router.navigate(['/tours']);
  }
}
