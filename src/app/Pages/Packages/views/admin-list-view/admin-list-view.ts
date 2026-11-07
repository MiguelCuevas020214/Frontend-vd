import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TravelPackage } from '../../../../Core/Interfaces/package.interface';
import { PackageService } from '../../../../Core/Services/package.service';
import { ToastService } from '../../../../Core/Services/toast.service';
import { formatDate, formatPrice, getErrorMessage } from '../../../../Core/Utils/format.utils';
import { ButtonComponent } from '../../../../Shared/Components/home-components/Buttons/button/button';
import {
  DataTableComponent,
  TableColumn,
} from '../../../../Shared/Components/home-components/Cards/data-table/data-table';
import { SearchInputComponent } from '../../../../Shared/Components/home-components/Inputs/search-input/search-input';
import { ConfirmModalComponent } from '../../../../Shared/Components/home-components/Modals/confirm-modal/confirm-modal';
import { PackageDetailModalComponent } from '../../../../Shared/Components/home-components/Modals/package-detail-modal/package-detail-modal';
import { PackageFormModalComponent } from '../../../../Shared/Components/home-components/Modals/package-form-modal/package-form-modal';

interface PackageRow {
  name: string;
  destinations: string;
  days: string;
  price: string;
  startDate: string;
  item: TravelPackage;
}

@Component({
  selector: 'app-admin-package-list-view',
  standalone: true,
  imports: [
    ButtonComponent,
    DataTableComponent,
    SearchInputComponent,
    ConfirmModalComponent,
    PackageDetailModalComponent,
    PackageFormModalComponent,
  ],
  templateUrl: './admin-list-view.html',
  styleUrl: './admin-list-view.css',
})
export class AdminPackageListViewComponent implements OnInit {
  private readonly packageService = inject(PackageService);
  private readonly toast = inject(ToastService);
  readonly packages = signal<TravelPackage[]>([]);
  readonly loading = signal(true);
  readonly query = signal('');
  readonly formOpen = signal(false);
  readonly selectedPackage = signal<TravelPackage | null>(null);
  readonly detailPackage = signal<TravelPackage | null>(null);
  readonly deletePackage = signal<TravelPackage | null>(null);
  readonly deleting = signal(false);
  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Paquete' },
    { key: 'destinations', label: 'Destinos' },
    { key: 'days', label: 'Duración' },
    { key: 'price', label: 'Precio' },
    { key: 'startDate', label: 'Próxima salida' },
  ];
  readonly rows = computed<PackageRow[]>(() => {
    const search = this.query().toLowerCase().trim();
    return this.packages()
      .filter(
        (item) =>
          !search || `${item.name} ${item.destinations.join(' ')}`.toLowerCase().includes(search),
      )
      .map((item) => ({
        name: item.name,
        destinations: item.destinations.join(', '),
        days: `${item.days} días`,
        price: formatPrice(item.pricePerPerson),
        startDate: formatDate(item.startDate, { day: '2-digit', month: 'short', year: 'numeric' }),
        item,
      }));
  });

  ngOnInit(): void {
    this.load();
  }
  load(): void {
    this.loading.set(true);
    this.packageService.get().subscribe({
      next: (items) => {
        this.packages.set(items);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.toast.error(getErrorMessage(error));
      },
    });
  }
  openCreate(): void {
    this.selectedPackage.set(null);
    this.formOpen.set(true);
  }
  openEdit(item: TravelPackage): void {
    this.detailPackage.set(null);
    this.selectedPackage.set(item);
    this.formOpen.set(true);
  }
  rowPackage(row: unknown): TravelPackage {
    return (row as PackageRow).item;
  }
  onSaved(): void {
    this.formOpen.set(false);
    this.selectedPackage.set(null);
    this.load();
  }
  confirmDelete(): void {
    const item = this.deletePackage();
    if (!item) return;
    this.deleting.set(true);
    this.packageService.delete(item.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deletePackage.set(null);
        this.toast.success('Paquete eliminado correctamente.');
        this.load();
      },
      error: (error: unknown) => {
        this.deleting.set(false);
        this.toast.error(getErrorMessage(error));
      },
    });
  }
}
