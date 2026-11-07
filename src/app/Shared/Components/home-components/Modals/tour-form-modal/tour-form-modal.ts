import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CreateTourDTO,
  Tour,
  TourItineraryDay,
} from '../../../../../Core/Interfaces/tour.interface';
import { ToastService } from '../../../../../Core/Services/toast.service';
import { TourService } from '../../../../../Core/Services/tour.service';
import { getErrorMessage } from '../../../../../Core/Utils/format.utils';
import { AddMoreBtnComponent } from '../../Buttons/add-more-btn/add-more-btn';
import { ButtonComponent } from '../../Buttons/button/button';
import { SaveButtonComponent } from '../../Buttons/save-button/save-button';
import { ImageInputComponent } from '../../Inputs/image-input/image-input';
import { InputFieldComponent } from '../../Inputs/input-field/input-field';
import { SelectComponent, SelectValue } from '../../Inputs/select/select';
import { ModalComponent } from '../modal/modal';

const emptyTour = (): CreateTourDTO => ({
  name: '',
  destination: '',
  shortDescription: '',
  description: '',
  durationDays: 1,
  durationNights: 0,
  price: 0,
  images: [],
  itinerary: [{ day: 1, title: '', description: '' }],
  includes: [],
  excludes: [],
  category: 'Cultural',
  featured: false,
  status: 'active',
});

@Component({
  selector: 'app-tour-form-modal',
  standalone: true,
  imports: [
    FormsModule,
    ModalComponent,
    InputFieldComponent,
    SelectComponent,
    ImageInputComponent,
    ButtonComponent,
    SaveButtonComponent,
    AddMoreBtnComponent,
  ],
  templateUrl: './tour-form-modal.html',
  styleUrl: './tour-form-modal.css',
})
export class TourFormModalComponent implements OnInit {
  @Input() tour: Tour | null = null;
  @Output() saved = new EventEmitter<Tour>();
  @Output() cancelled = new EventEmitter<void>();
  private readonly tourService = inject(TourService);
  private readonly toast = inject(ToastService);
  form = emptyTour();
  includesText = '';
  excludesText = '';
  galleryText = '';
  notesText = '';
  readonly saving = signal(false);
  readonly error = signal('');
  readonly sections = signal({ general: true, details: true, itinerary: false });

  ngOnInit(): void {
    if (!this.tour) return;
    const { id: _id, createdAt: _createdAt, ...data } = this.tour;
    this.form = JSON.parse(JSON.stringify(data)) as CreateTourDTO;
    this.includesText = this.form.includes.join('\n');
    this.excludesText = this.form.excludes.join('\n');
    this.galleryText = this.form.images.slice(1).join('\n');
    this.notesText = (this.form.importantNotes ?? []).join('\n');
  }

  highlightsText(day: TourItineraryDay): string {
    return (day.highlights ?? []).join('\n');
  }

  setHighlights(day: TourItineraryDay, value: string | number | null): void {
    day.highlights = String(value ?? '')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  toggleSection(section: 'general' | 'details' | 'itinerary'): void {
    this.sections.update((value) => ({ ...value, [section]: !value[section] }));
  }

  setNumber(
    field: 'durationDays' | 'durationNights' | 'price',
    value: string | number | null,
  ): void {
    this.form[field] = Number(value ?? 0);
  }

  setCategory(value: SelectValue | null): void {
    this.form.category = String(value ?? 'Cultural');
  }
  setStatus(value: SelectValue | null): void {
    this.form.status = value === 'inactive' ? 'inactive' : 'active';
  }

  addDay(): void {
    this.form.itinerary.push({ day: this.form.itinerary.length + 1, title: '', description: '' });
  }

  removeDay(index: number): void {
    this.form.itinerary.splice(index, 1);
    this.form.itinerary.forEach((day, position) => (day.day = position + 1));
  }

  save(): void {
    this.error.set('');
    if (!this.form.name.trim() || !this.form.destination.trim() || this.form.price <= 0) {
      this.error.set('Completa el nombre, el destino y un precio mayor que cero.');
      return;
    }
    if (!this.form.images.length || !this.form.images[0]) {
      this.error.set('Agrega una imagen principal para el tour.');
      return;
    }
    this.form.includes = this.includesText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
    this.form.excludes = this.excludesText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
    this.form.importantNotes = this.notesText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
    this.form.images = [
      this.form.images[0],
      ...this.galleryText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    ];
    this.saving.set(true);
    const request = this.tour
      ? this.tourService.update(this.tour.id, this.form)
      : this.tourService.create(this.form);
    request.subscribe({
      next: (tour) => {
        this.saving.set(false);
        this.toast.success(
          this.tour ? 'Tour actualizado correctamente.' : 'Tour creado correctamente.',
        );
        this.saved.emit(tour);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(getErrorMessage(error));
        this.toast.error('No pudimos guardar el tour.');
      },
    });
  }
}
