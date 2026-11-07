import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CreateDepartureDTO, Departure } from '../../../../../Core/Interfaces/departure.interface';
import { TravelPackage } from '../../../../../Core/Interfaces/package.interface';
import { Tour } from '../../../../../Core/Interfaces/tour.interface';
import { DepartureService } from '../../../../../Core/Services/departure.service';
import { PackageService } from '../../../../../Core/Services/package.service';
import { ToastService } from '../../../../../Core/Services/toast.service';
import { TourService } from '../../../../../Core/Services/tour.service';
import { getErrorMessage, toDateInputValue } from '../../../../../Core/Utils/format.utils';
import { ButtonComponent } from '../../Buttons/button/button';
import { SaveButtonComponent } from '../../Buttons/save-button/save-button';
import { InputFieldComponent } from '../../Inputs/input-field/input-field';
import { SelectComponent, SelectOptionInput, SelectValue } from '../../Inputs/select/select';
import { ModalComponent } from '../modal/modal';

@Component({
  selector: 'app-departure-form-modal',
  standalone: true,
  imports: [
    FormsModule,
    ModalComponent,
    ButtonComponent,
    SaveButtonComponent,
    InputFieldComponent,
    SelectComponent,
  ],
  templateUrl: './departure-form-modal.html',
  styleUrl: './departure-form-modal.css',
})
export class DepartureFormModalComponent implements OnInit {
  @Input() departure: Departure | null = null;
  @Input() initialDate = toDateInputValue(new Date());
  @Output() saved = new EventEmitter<Departure>();
  @Output() cancelled = new EventEmitter<void>();
  private readonly departureService = inject(DepartureService);
  private readonly tourService = inject(TourService);
  private readonly packageService = inject(PackageService);
  private readonly toast = inject(ToastService);
  readonly tours = signal<Tour[]>([]);
  readonly packages = signal<TravelPackage[]>([]);
  readonly saving = signal(false);
  readonly error = signal('');
  form: CreateDepartureDTO = {
    productType: 'tour',
    productId: '',
    date: this.initialDate,
    totalSlots: 16,
    availableSlots: 16,
    price: 0,
    status: 'active',
  };
  readonly productOptions = computed<SelectOptionInput[]>(() =>
    this.form.productType === 'tour'
      ? this.tours()
          .filter((item) => item.status === 'active')
          .map((item) => ({ label: item.name, value: item.id }))
      : this.packages()
          .filter((item) => item.status === 'active')
          .map((item) => ({ label: item.name, value: item.id })),
  );

  ngOnInit(): void {
    if (this.departure) {
      const { id: _id, createdAt: _createdAt, ...data } = this.departure;
      this.form = { ...data };
    } else {
      this.form.date = this.initialDate;
    }
    forkJoin({ tours: this.tourService.get(), packages: this.packageService.get() }).subscribe({
      next: ({ tours, packages }) => {
        this.tours.set(tours);
        this.packages.set(packages);
        if (!this.form.productId) this.selectInitialProduct();
      },
      error: (error: unknown) => this.error.set(getErrorMessage(error)),
    });
  }

  setProductType(value: SelectValue | null): void {
    this.form.productType = value === 'package' ? 'package' : 'tour';
    this.form.productId = '';
    this.form.price = 0;
    this.selectInitialProduct();
  }
  setProduct(value: SelectValue | null): void {
    this.form.productId = String(value ?? '');
    const product =
      this.form.productType === 'tour'
        ? this.tours().find((item) => item.id === this.form.productId)
        : this.packages().find((item) => item.id === this.form.productId);
    if (product) this.form.price = 'price' in product ? product.price : product.pricePerPerson;
  }
  setNumber(field: 'totalSlots' | 'availableSlots' | 'price', value: string | number | null): void {
    this.form[field] = Number(value ?? 0);
  }
  setStatus(value: SelectValue | null): void {
    this.form.status = value === 'inactive' ? 'inactive' : 'active';
  }

  save(): void {
    this.error.set('');
    if (
      !this.form.productId ||
      !this.form.date ||
      this.form.price <= 0 ||
      this.form.totalSlots <= 0
    ) {
      this.error.set('Completa el viaje, la fecha, los cupos y el precio.');
      return;
    }
    if (this.form.availableSlots < 0 || this.form.availableSlots > this.form.totalSlots) {
      this.error.set('Los cupos disponibles deben estar entre 0 y el total de cupos.');
      return;
    }
    this.saving.set(true);
    const request = this.departure
      ? this.departureService.update(this.departure.id, this.form)
      : this.departureService.create(this.form);
    request.subscribe({
      next: (departure) => {
        this.saving.set(false);
        this.toast.success(
          this.departure ? 'Salida actualizada correctamente.' : 'Salida creada correctamente.',
        );
        this.saved.emit(departure);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(getErrorMessage(error));
        this.toast.error('No pudimos guardar la salida.');
      },
    });
  }

  private selectInitialProduct(): void {
    const first = this.productOptions()[0];
    if (first && typeof first === 'object') this.setProduct(first.value);
  }
}
