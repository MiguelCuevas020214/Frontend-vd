import { Component, inject, OnInit, signal } from '@angular/core';
import { SiteContent } from '../../../../Core/Interfaces/content.interface';
import { ContentService } from '../../../../Core/Services/content.service';
import { ToastService } from '../../../../Core/Services/toast.service';
import { getErrorMessage } from '../../../../Core/Utils/format.utils';
import { ButtonComponent } from '../../../../Shared/Components/home-components/Buttons/button/button';
import { AboutFormModalComponent } from '../../../../Shared/Components/home-components/Modals/about-form-modal/about-form-modal';

@Component({
  selector: 'app-edit-about-view',
  standalone: true,
  imports: [ButtonComponent, AboutFormModalComponent],
  templateUrl: './edit-about-view.html',
  styleUrl: './edit-about-view.css',
})
export class EditAboutViewComponent implements OnInit {
  private readonly contentService = inject(ContentService);
  private readonly toast = inject(ToastService);
  readonly content = signal<SiteContent | null>(null);
  readonly loading = signal(true);
  readonly formOpen = signal(false);
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
  onSaved(content: SiteContent): void {
    this.content.set(content);
    this.formOpen.set(false);
  }
}
