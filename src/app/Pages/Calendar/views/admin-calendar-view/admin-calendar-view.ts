import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Departure, DepartureWithProduct } from '../../../../Core/Interfaces/departure.interface';
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
import { ButtonComponent } from '../../../../Shared/Components/home-components/Buttons/button/button';
import { ConfirmModalComponent } from '../../../../Shared/Components/home-components/Modals/confirm-modal/confirm-modal';
import { DepartureFormModalComponent } from '../../../../Shared/Components/home-components/Modals/departure-form-modal/departure-form-modal';

interface AdminCalendarDay {
  date: string;
  dayNumber: number;
  departures: DepartureWithProduct[];
}

@Component({
  selector: 'app-admin-calendar-view',
  standalone: true,
  imports: [
    StatusBadgeComponent,
    ButtonComponent,
    ConfirmModalComponent,
    DepartureFormModalComponent,
  ],
  templateUrl: './admin-calendar-view.html',
  styleUrl: './admin-calendar-view.css',
})
export class AdminCalendarViewComponent implements OnInit {
  private readonly departureService = inject(DepartureService);
  private readonly tourService = inject(TourService);
  private readonly packageService = inject(PackageService);
  private readonly toast = inject(ToastService);
  readonly loading = signal(true);
  readonly departures = signal<DepartureWithProduct[]>([]);
  readonly monthCursor = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  readonly selectedDate = signal(toDateInputValue(new Date()));
  readonly formOpen = signal(false);
  readonly selectedDeparture = signal<Departure | null>(null);
  readonly deleteDeparture = signal<DepartureWithProduct | null>(null);
  readonly deleting = signal(false);
  readonly weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  readonly monthLabel = computed(() =>
    new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(this.monthCursor()),
  );
  readonly calendarDays = computed(() => {
    const cursor = this.monthCursor();
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    const total = new Date(year, month + 1, 0).getDate();
    return Array.from(
      { length: Math.ceil((offset + total) / 7) * 7 },
      (_, index): AdminCalendarDay | null => {
        const dayNumber = index - offset + 1;
        if (dayNumber < 1 || dayNumber > total) return null;
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
        const enriched = departures.flatMap((departure) => {
          const product =
            departure.productType === 'tour'
              ? tours.find((item) => item.id === departure.productId)
              : packages.find((item) => item.id === departure.productId);
          if (!product) return [];
          const destination =
            'destination' in product ? product.destination : product.destinations.join(' · ');
          const image = 'images' in product ? product.images[0] : product.image;
          return [{ ...departure, productName: product.name, destination, image }];
        });
        this.departures.set(enriched);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.toast.error(getErrorMessage(error));
      },
    });
  }
  changeMonth(amount: number): void {
    const next = new Date(
      this.monthCursor().getFullYear(),
      this.monthCursor().getMonth() + amount,
      1,
    );
    this.monthCursor.set(next);
    this.selectedDate.set(toDateInputValue(next));
  }
  openCreate(): void {
    this.selectedDeparture.set(null);
    this.formOpen.set(true);
  }
  openEdit(item: DepartureWithProduct): void {
    this.selectedDeparture.set(item);
    this.formOpen.set(true);
  }
  onSaved(): void {
    this.formOpen.set(false);
    this.selectedDeparture.set(null);
    this.load();
  }
  price(value: number): string {
    return formatPrice(value);
  }
  confirmDelete(): void {
    const item = this.deleteDeparture();
    if (!item) return;
    this.deleting.set(true);
    this.departureService.delete(item.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deleteDeparture.set(null);
        this.toast.success('Salida eliminada correctamente.');
        this.load();
      },
      error: (error: unknown) => {
        this.deleting.set(false);
        this.toast.error(getErrorMessage(error));
      },
    });
  }
}
