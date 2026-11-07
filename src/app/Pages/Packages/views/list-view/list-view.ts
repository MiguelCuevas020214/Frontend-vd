import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TravelPackage } from '../../../../Core/Interfaces/package.interface';
import { PackageService } from '../../../../Core/Services/package.service';
import { ToastService } from '../../../../Core/Services/toast.service';
import { formatPrice, getErrorMessage } from '../../../../Core/Utils/format.utils';
import { ButtonComponent } from '../../../../Shared/Components/home-components/Buttons/button/button';
import { DynamicCardComponent } from '../../../../Shared/Components/home-components/Cards/dynamic-card/dynamic-card';
import { FilterChipComponent } from '../../../../Shared/Components/home-components/Filters/filter-chip/filter-chip';
import { SearchInputComponent } from '../../../../Shared/Components/home-components/Inputs/search-input/search-input';

@Component({
  selector: 'app-package-list-view',
  standalone: true,
  imports: [SearchInputComponent, FilterChipComponent, DynamicCardComponent, ButtonComponent],
  templateUrl: './list-view.html',
  styleUrl: './list-view.css',
})
export class PackageListViewComponent implements OnInit {
  private readonly packageService = inject(PackageService);
  private readonly toast = inject(ToastService);
  readonly packages = signal<TravelPackage[]>([]);
  readonly loading = signal(true);
  readonly query = signal('');
  readonly duration = signal('');
  readonly filteredPackages = computed(() => {
    const search = this.query().trim().toLowerCase();
    return this.packages().filter((item) => {
      const matchesSearch =
        !search || `${item.name} ${item.destinations.join(' ')}`.toLowerCase().includes(search);
      const matchesDuration =
        !this.duration() ||
        (this.duration() === 'week' && item.days <= 7) ||
        (this.duration() === 'long' && item.days > 7);
      return item.status === 'active' && matchesSearch && matchesDuration;
    });
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
  clear(): void {
    this.query.set('');
    this.duration.set('');
  }
  price(value: number): string {
    return formatPrice(value);
  }
}
