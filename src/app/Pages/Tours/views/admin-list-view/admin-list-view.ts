import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Tour } from '../../../../Core/Interfaces/tour.interface';
import { ToastService } from '../../../../Core/Services/toast.service';
import { TourService } from '../../../../Core/Services/tour.service';
import { formatPrice, getErrorMessage } from '../../../../Core/Utils/format.utils';
import { getTourSection } from '../../../../Core/Utils/tour.utils';
import { ButtonComponent } from '../../../../Shared/Components/home-components/Buttons/button/button';
import {
  DataTableComponent,
  TableColumn,
} from '../../../../Shared/Components/home-components/Cards/data-table/data-table';
import { SearchInputComponent } from '../../../../Shared/Components/home-components/Inputs/search-input/search-input';
import {
  SelectComponent,
  SelectValue,
} from '../../../../Shared/Components/home-components/Inputs/select/select';
import { ConfirmModalComponent } from '../../../../Shared/Components/home-components/Modals/confirm-modal/confirm-modal';
import { TourDetailModalComponent } from '../../../../Shared/Components/home-components/Modals/tour-detail-modal/tour-detail-modal';
import { TourFormModalComponent } from '../../../../Shared/Components/home-components/Modals/tour-form-modal/tour-form-modal';

interface TourRow {
  id: string;
  name: string;
  destination: string;
  duration: string;
  price: string;
  section: string;
  status: string;
  tour: Tour;
}

@Component({
  selector: 'app-admin-tour-list-view',
  standalone: true,
  imports: [
    ButtonComponent,
    DataTableComponent,
    SearchInputComponent,
    SelectComponent,
    ConfirmModalComponent,
    TourDetailModalComponent,
    TourFormModalComponent,
  ],
  templateUrl: './admin-list-view.html',
  styleUrl: './admin-list-view.css',
})
export class AdminTourListViewComponent implements OnInit {
  private readonly tourService = inject(TourService);
  private readonly toast = inject(ToastService);
  readonly tours = signal<Tour[]>([]);
  readonly loading = signal(true);
  readonly query = signal('');
  readonly status = signal('');
  readonly formOpen = signal(false);
  readonly selectedTour = signal<Tour | null>(null);
  readonly detailTour = signal<Tour | null>(null);
  readonly deleteTour = signal<Tour | null>(null);
  readonly deleting = signal(false);
  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Tour' },
    { key: 'destination', label: 'Destino' },
    { key: 'duration', label: 'Duración' },
    { key: 'section', label: 'Sección' },
    { key: 'price', label: 'Precio' },
    { key: 'status', label: 'Estado' },
  ];
  readonly rows = computed<TourRow[]>(() => {
    const search = this.query().toLowerCase().trim();
    return this.tours()
      .filter(
        (tour) =>
          (!search || `${tour.name} ${tour.destination}`.toLowerCase().includes(search)) &&
          (!this.status() || tour.status === this.status()),
      )
      .map((tour) => ({
        id: tour.id,
        name: tour.name,
        destination: tour.destination,
        duration: `${tour.durationDays} días / ${tour.durationNights} noches`,
        price: formatPrice(tour.price),
        section: getTourSection(tour),
        status: tour.status === 'active' ? 'Activo' : 'Inactivo',
        tour,
      }));
  });
  readonly activeCount = computed(
    () => this.tours().filter((tour) => tour.status === 'active').length,
  );
  readonly featuredCount = computed(() => this.tours().filter((tour) => tour.featured).length);

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
  setStatus(value: SelectValue | null): void {
    this.status.set(String(value ?? ''));
  }
  openCreate(): void {
    this.selectedTour.set(null);
    this.formOpen.set(true);
  }
  openEdit(tour: Tour): void {
    this.detailTour.set(null);
    this.selectedTour.set(tour);
    this.formOpen.set(true);
  }
  rowTour(row: unknown): Tour {
    return (row as TourRow).tour;
  }
  confirmDelete(): void {
    const tour = this.deleteTour();
    if (!tour) return;
    this.deleting.set(true);
    this.tourService.delete(tour.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deleteTour.set(null);
        this.toast.success('Tour eliminado correctamente.');
        this.load();
      },
      error: (error: unknown) => {
        this.deleting.set(false);
        this.toast.error(getErrorMessage(error));
      },
    });
  }
  onSaved(): void {
    this.formOpen.set(false);
    this.selectedTour.set(null);
    this.load();
  }
}
