import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreatePackageDTO, TravelPackage } from '../../../../../Core/Interfaces/package.interface';
import { PackageService } from '../../../../../Core/Services/package.service';
import { ToastService } from '../../../../../Core/Services/toast.service';
import { getErrorMessage, toDateInputValue } from '../../../../../Core/Utils/format.utils';
import { ButtonComponent } from '../../Buttons/button/button';
import { SaveButtonComponent } from '../../Buttons/save-button/save-button';
import { ImageInputComponent } from '../../Inputs/image-input/image-input';
import { InputFieldComponent } from '../../Inputs/input-field/input-field';
import { SelectComponent, SelectValue } from '../../Inputs/select/select';
import { ModalComponent } from '../modal/modal';

const emptyPackage = (): CreatePackageDTO => ({
  name: '',
  shortDescription: '',
  description: '',
  days: 7,
  destinations: [],
  pricePerPerson: 0,
  image: '',
  startDate: toDateInputValue(new Date()),
  endDate: toDateInputValue(new Date()),
  featured: false,
  status: 'active',
});

@Component({
  selector: 'app-package-form-modal',
  standalone: true,
  imports: [
    FormsModule,
    ModalComponent,
    InputFieldComponent,
    SelectComponent,
    ImageInputComponent,
    ButtonComponent,
    SaveButtonComponent,
  ],
  templateUrl: './package-form-modal.html',
  styleUrl: './package-form-modal.css',
})
export class PackageFormModalComponent implements OnInit {
  @Input() item: TravelPackage | null = null;
  @Output() saved = new EventEmitter<TravelPackage>();
  @Output() cancelled = new EventEmitter<void>();
  private readonly packageService = inject(PackageService);
  private readonly toast = inject(ToastService);
  form = emptyPackage();
  destinationsText = '';
  readonly saving = signal(false);
  readonly error = signal('');
  detailsOpen = true;

  ngOnInit(): void {
    if (!this.item) return;
    const { id: _id, createdAt: _createdAt, ...data } = this.item;
    this.form = { ...data, destinations: [...data.destinations] };
    this.destinationsText = this.form.destinations.join('\n');
  }

  setNumber(field: 'days' | 'pricePerPerson', value: string | number | null): void {
    this.form[field] = Number(value ?? 0);
  }
  setStatus(value: SelectValue | null): void {
    this.form.status = value === 'inactive' ? 'inactive' : 'active';
  }

  save(): void {
    this.error.set('');
    this.form.destinations = this.destinationsText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
    if (!this.form.name.trim() || !this.form.destinations.length || this.form.pricePerPerson <= 0) {
      this.error.set('Completa el nombre, al menos un destino y un precio mayor que cero.');
      return;
    }
    if (!this.form.image) {
      this.error.set('Agrega una imagen para el paquete.');
      return;
    }
    if (this.form.endDate < this.form.startDate) {
      this.error.set('La fecha de regreso debe ser posterior a la salida.');
      return;
    }
    this.saving.set(true);
    const request = this.item
      ? this.packageService.update(this.item.id, this.form)
      : this.packageService.create(this.form);
    request.subscribe({
      next: (item) => {
        this.saving.set(false);
        this.toast.success(
          this.item ? 'Paquete actualizado correctamente.' : 'Paquete creado correctamente.',
        );
        this.saved.emit(item);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(getErrorMessage(error));
        this.toast.error('No pudimos guardar el paquete.');
      },
    });
  }
}
