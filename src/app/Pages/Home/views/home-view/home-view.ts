import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SiteContent } from '../../../../Core/Interfaces/content.interface';
import { Tour } from '../../../../Core/Interfaces/tour.interface';
import { ContentService } from '../../../../Core/Services/content.service';
import { ToastService } from '../../../../Core/Services/toast.service';
import { TourService } from '../../../../Core/Services/tour.service';
import { formatPrice, getErrorMessage } from '../../../../Core/Utils/format.utils';
import { isExpressTour } from '../../../../Core/Utils/tour.utils';
import { ButtonComponent } from '../../../../Shared/Components/home-components/Buttons/button/button';
import { DynamicCardComponent } from '../../../../Shared/Components/home-components/Cards/dynamic-card/dynamic-card';

const HERO_INTERVAL_MS = 5000;

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [ButtonComponent, DynamicCardComponent],
  templateUrl: './home-view.html',
  styleUrl: './home-view.css',
})
export class HomeViewComponent implements OnInit, OnDestroy {
  private readonly contentService = inject(ContentService);
  private readonly tourService = inject(TourService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private heroTimer?: ReturnType<typeof setInterval>;
  readonly content = signal<SiteContent | null>(null);
  readonly tours = signal<Tour[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly heroIndex = signal(0);
  readonly heroImages = computed<string[]>(() => {
    const home = this.content()?.home;
    if (!home) return [];
    return home.heroImages?.length ? home.heroImages : [home.heroImage];
  });
  readonly featuredTours = computed(() => {
    const ids = this.content()?.home.featuredTourIds;
    const active = this.tours().filter((tour) => tour.status === 'active');
    return ids?.length
      ? ids
          .map((id) => active.find((tour) => tour.id === id))
          .filter((tour): tour is Tour => !!tour)
      : active.filter((tour) => tour.featured).slice(0, 3);
  });
  readonly expressTours = computed(() =>
    this.tours()
      .filter((tour) => tour.status === 'active' && isExpressTour(tour))
      .slice(0, 3),
  );

  ngOnInit(): void {
    this.load();
    this.startHeroRotation();
  }

  ngOnDestroy(): void {
    this.stopHeroRotation();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(false);
    forkJoin({
      content: this.contentService.get(),
      tours: this.tourService.get(),
    }).subscribe({
      next: ({ content, tours }) => {
        this.content.set(content);
        this.tours.set(tours);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.loadError.set(true);
        this.toast.error(getErrorMessage(error));
      },
    });
  }

  goToSlide(index: number): void {
    this.heroIndex.set(index);
    this.startHeroRotation();
  }

  navigate(path: string): void {
    void this.router.navigate([path]);
  }

  price(value: number): string {
    return formatPrice(value);
  }

  private startHeroRotation(): void {
    this.stopHeroRotation();
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.heroTimer = setInterval(() => {
      const total = this.heroImages().length;
      if (total > 1) {
        this.heroIndex.update((index) => (index + 1) % total);
      }
    }, HERO_INTERVAL_MS);
  }

  private stopHeroRotation(): void {
    if (this.heroTimer) {
      clearInterval(this.heroTimer);
      this.heroTimer = undefined;
    }
  }
}
