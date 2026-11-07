import { Component, inject, OnInit, signal } from '@angular/core';
import { SiteContent } from '../../../../Core/Interfaces/content.interface';
import { ContentService } from '../../../../Core/Services/content.service';
import { ToastService } from '../../../../Core/Services/toast.service';
import { getErrorMessage } from '../../../../Core/Utils/format.utils';

@Component({
  selector: 'app-about-view',
  standalone: true,
  templateUrl: './about-view.html',
  styleUrl: './about-view.css',
})
export class AboutViewComponent implements OnInit {
  private readonly contentService = inject(ContentService);
  private readonly toast = inject(ToastService);
  readonly content = signal<SiteContent | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.contentService.get().subscribe({
      next: (content) => {
        this.content.set(content);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.toast.error(getErrorMessage(error));
      },
    });
  }
}
