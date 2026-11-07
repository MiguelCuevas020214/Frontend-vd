import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DepartureWithProduct } from '../../../../Core/Interfaces/departure.interface';
import { TravelPackage } from '../../../../Core/Interfaces/package.interface';
import { Tour } from '../../../../Core/Interfaces/tour.interface';
import { DepartureService } from '../../../../Core/Services/departure.service';
import { PackageService } from '../../../../Core/Services/package.service';
import { ToastService } from '../../../../Core/Services/toast.service';
import { TourService } from '../../../../Core/Services/tour.service';
import {
  formatPrice,
  getErrorMessage,
  toDateInputValue,
} from '../../../../Core/Utils/format.utils';
import { StatusBadgeComponent } from '../../../../Shared/Components/home-components/Badges/status-badge/status-badge';

export interface CalendarDay {
  date: string;
  dayNumber: number;
  departures: DepartureWithProduct[];
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.css',
})
export class CalendarViewComponent implements OnInit {
  private readonly departureService = inject(DepartureService);
  private readonly tourService = inject(TourService);
  private readonly packageService = inject(PackageService);
  private readonly toast = inject(ToastService);
  readonly loading = signal(true);
  readonly departures = signal<DepartureWithProduct[]>([]);
  readonly today = toDateInputValue(new Date());
  readonly selectedDate = signal(this.today);
  readonly monthCursor = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  readonly weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  readonly monthLabel = computed(() =>
    new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(this.monthCursor()),
  );
  readonly calendarDays = computed(() => {
    const cursor = this.monthCursor();
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from(
      { length: Math.ceil((offset + daysInMonth) / 7) * 7 },
      (_, index): CalendarDay | null => {
        const dayNumber = index - offset + 1;
        if (dayNumber < 1 || dayNumber > daysInMonth) return null;
        const date = toDateInputValue(new Date(year, month, dayNumber));
        return {
          date,
          dayNumber,
          departures: this.departures().filter((item) => item.date === date),
        };
      },
    );
  });
  readonly selectedDepartures = computed(() =>
    this.departures().filter((item) => item.date === this.selectedDate()),
  );
  readonly selectedDateLabel = computed(() =>
    new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(
      new Date(`${this.selectedDate()}T12:00:00`),
    ),
  );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    forkJoin({
      departures: this.departureService.get(),
      tours: this.tourService.get(),
      packages: this.packageService.get(),
    }).subscribe({
      next: ({ departures, tours, packages }) => {
        this.departures.set(
          this.enrich(
            departures.filter((item) => item.status === 'active'),
            tours,
            packages,
          ),
        );
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.toast.error(getErrorMessage(error));
      },
    });
  }

  changeMonth(amount: number): void {
    const cursor = this.monthCursor();
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + amount, 1);
    this.monthCursor.set(next);
    this.selectedDate.set(toDateInputValue(next));
  }

  goToday(): void {
    const now = new Date();
    this.monthCursor.set(new Date(now.getFullYear(), now.getMonth(), 1));
    this.selectedDate.set(this.today);
  }

  price(value: number): string {
    return formatPrice(value);
  }

  private enrich(
    departures: import('../../../../Core/Interfaces/departure.interface').Departure[],
    tours: Tour[],
    packages: TravelPackage[],
  ): DepartureWithProduct[] {
    return departures.flatMap((departure) => {
      const product =
        departure.productType === 'tour'
          ? tours.find((tour) => tour.id === departure.productId)
          : packages.find((item) => item.id === departure.productId);
      if (!product) return [];
      return [
        {
          ...departure,
          productName: product.name,
          destination:
            departure.productType === 'tour'
              ? (product as Tour).destination
              : (product as TravelPackage).destinations.join(' · '),
          image:
            departure.productType === 'tour'
              ? (product as Tour).images[0]
              : (product as TravelPackage).image,
        },
      ];
    });
  }
}
