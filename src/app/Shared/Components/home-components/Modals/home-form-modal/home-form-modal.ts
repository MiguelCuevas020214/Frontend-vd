import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeContent, SiteContent } from '../../../../../Core/Interfaces/content.interface';
import { Tour } from '../../../../../Core/Interfaces/tour.interface';
import { ContentService } from '../../../../../Core/Services/content.service';
import { ToastService } from '../../../../../Core/Services/toast.service';
import { getErrorMessage } from '../../../../../Core/Utils/format.utils';
import { ButtonComponent } from '../../Buttons/button/button';
import { SaveButtonComponent } from '../../Buttons/save-button/save-button';
import { ImageInputComponent } from '../../Inputs/image-input/image-input';
import { InputFieldComponent } from '../../Inputs/input-field/input-field';
import { ModalComponent } from '../modal/modal';

@Component({
  selector: 'app-home-form-modal',
  standalone: true,
  imports: [
    FormsModule,
    ModalComponent,
    ButtonComponent,
    SaveButtonComponent,
    ImageInputComponent,
    InputFieldComponent,
  ],
  templateUrl: './home-form-modal.html',
  styleUrl: './home-form-modal.css',
})
export class HomeFormModalComponent implements OnInit {
  @Input({ required: true }) content!: HomeContent;
  @Input() tours: Tour[] = [];
  @Output() saved = new EventEmitter<SiteContent>();
  @Output() cancelled = new EventEmitter<void>();
  private readonly contentService = inject(ContentService);
  private readonly toast = inject(ToastService);
  form!: HomeContent;
  readonly saving = signal(false);
  readonly error = signal('');
  heroOpen = true;
  featuredOpen = false;
  heroImagesText = '';

  ngOnInit(): void {
    this.form = JSON.parse(JSON.stringify(this.content)) as HomeContent;
    this.form.heroImages = this.form.heroImages ?? [];
    this.heroImagesText = this.form.heroImages.slice(1).join('\n');
  }

  setHeroImage(value: string): void {
    this.form.heroImage = value;
  }

  toggleFeatured(id: string): void {
    const ids = this.form.featuredTourIds;
    this.form.featuredTourIds = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
  }

  save(): void {
    this.error.set('');
    if (!this.form.heroTitle.trim() || !this.form.heroSubtitle.trim() || !this.form.heroImage) {
      this.error.set('Completa el título, el texto y la imagen principal.');
      return;
    }
    const extraImages = this.heroImagesText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
    this.form.heroImages = [this.form.heroImage, ...extraImages].filter(Boolean);
    this.saving.set(true);
    this.contentService.update({ home: this.form }).subscribe({
      next: (content) => {
        this.saving.set(false);
        this.toast.success('Contenido del home actualizado.');
        this.saved.emit(content);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(getErrorMessage(error));
        this.toast.error('No pudimos guardar el contenido.');
      },
    });
  }
}
