import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TourService } from '../../../../Core/Services/tour.service';
import { ToastService } from '../../../../Core/Services/toast.service';
import { Tour } from '../../../../Core/Interfaces/tour.interface';
import { formatPrice, getErrorMessage } from '../../../../Core/Utils/format.utils';
import { isExpressTour } from '../../../../Core/Utils/tour.utils';
import { SearchInputComponent } from '../../../../Shared/Components/home-components/Inputs/search-input/search-input';
import {
  SelectComponent,
  SelectValue,
} from '../../../../Shared/Components/home-components/Inputs/select/select';
import { FilterPopoverComponent } from '../../../../Shared/Components/home-components/Filters/filter-popover/filter-popover';
import { FilterChipComponent } from '../../../../Shared/Components/home-components/Filters/filter-chip/filter-chip';
import { DynamicCardComponent } from '../../../../Shared/Components/home-components/Cards/dynamic-card/dynamic-card';
import { ButtonComponent } from '../../../../Shared/Components/home-components/Buttons/button/button';

@Component({
  selector: 'app-list-view',
  standalone: true,
  imports: [
    RouterLink,
    SearchInputComponent,
    SelectComponent,
    FilterPopoverComponent,
    FilterChipComponent,
    DynamicCardComponent,
    ButtonComponent,
  ],
  templateUrl: './list-view.html',
  styleUrl: './list-view.css',
})
export class TourListViewComponent implements OnInit {
  private readonly tourService = inject(TourService);
  private readonly toast = inject(ToastService);
  readonly tours = signal<Tour[]>([]);
  readonly loading = signal(true);
  readonly query = signal('');
  readonly destination = signal('');
  readonly duration = signal('');
  readonly maxPrice = signal(0);
  readonly visibleCount = signal(6);
  readonly destinations = computed(() =>
    [...new Set(this.tours().map((tour) => tour.destination))].sort(),
  );
  readonly activeFilterCount = computed(
    () =>
      [this.destination(), this.duration(), this.maxPrice() > 0 ? 'price' : ''].filter(Boolean)
        .length,
  );
  readonly filteredTours = computed(() => {
    const search = this.query().trim().toLowerCase();
    return this.tours().filter((tour) => {
      const matchesSearch =
        !search ||
        `${tour.name} ${tour.destination} ${tour.shortDescription}`.toLowerCase().includes(search);
      const matchesDestination = !this.destination() || tour.destination === this.destination();
      const matchesDuration =
        !this.duration() ||
        (this.duration() === 'short' && tour.durationDays <= 4) ||
        (this.duration() === 'medium' && tour.durationDays >= 5 && tour.durationDays <= 6) ||
        (this.duration() === 'long' && tour.durationDays >= 7);
      const matchesPrice = !this.maxPrice() || tour.price <= this.maxPrice();
      return (
        tour.status === 'active' &&
        !isExpressTour(tour) &&
        matchesSearch &&
        matchesDestination &&
        matchesDuration &&
        matchesPrice
      );
    });
  });
  readonly visibleTours = computed(() => this.filteredTours().slice(0, this.visibleCount()));

  constructor() {
    effect(() => {
      this.query();
      this.destination();
      this.duration();
      this.maxPrice();
      this.visibleCount.set(6);
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
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

  setDestination(value: SelectValue | null): void {
    this.destination.set(String(value ?? ''));
  }
  setMaxPrice(value: SelectValue | null): void {
    this.maxPrice.set(Number(value ?? 0));
  }
  clearFilters(): void {
    this.query.set('');
    this.destination.set('');
    this.duration.set('');
    this.maxPrice.set(0);
  }
  price(value: number): string {
    return formatPrice(value);
  }
}
