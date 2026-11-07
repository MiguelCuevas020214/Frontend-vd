import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SiteContent } from '../../../../Core/Interfaces/content.interface';
import { Tour } from '../../../../Core/Interfaces/tour.interface';
import { AuthService } from '../../../../Core/Services/auth.service';
import { ContentService } from '../../../../Core/Services/content.service';
import { DepartureService } from '../../../../Core/Services/departure.service';
import { ToastService } from '../../../../Core/Services/toast.service';
import { TourService } from '../../../../Core/Services/tour.service';
import { getErrorMessage } from '../../../../Core/Utils/format.utils';
import { isExpressTour } from '../../../../Core/Utils/tour.utils';
import { ButtonComponent } from '../../../../Shared/Components/home-components/Buttons/button/button';
import { HomeFormModalComponent } from '../../../../Shared/Components/home-components/Modals/home-form-modal/home-form-modal';

@Component({
  selector: 'app-edit-home-view',
  standalone: true,
  imports: [ButtonComponent, HomeFormModalComponent],
  templateUrl: './edit-home-view.html',
  styleUrl: './edit-home-view.css',
})
export class EditHomeViewComponent implements OnInit {
  private readonly contentService = inject(ContentService);
  private readonly tourService = inject(TourService);
  private readonly departureService = inject(DepartureService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly content = signal<SiteContent | null>(null);
  readonly tours = signal<Tour[]>([]);
  readonly departureCount = signal(0);
  readonly loading = signal(true);
  readonly formOpen = signal(false);
  readonly expressCount = computed(() => this.tours().filter((tour) => isExpressTour(tour)).length);
  readonly longTourCount = computed(() => this.tours().length - this.expressCount());

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    forkJoin({
      content: this.contentService.get(),
      tours: this.tourService.get(),
      departures: this.departureService.get(),
    }).subscribe({
      next: ({ content, tours, departures }) => {
        this.content.set(content);
        this.tours.set(tours);
        this.departureCount.set(departures.length);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.toast.error(getErrorMessage(error));
      },
    });
  }

  navigate(path: string): void {
    void this.router.navigate([path]);
  }

  onSaved(content: SiteContent): void {
    this.content.set(content);
    this.formOpen.set(false);
  }
}
