import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TravelPackage } from '../../../../../Core/Interfaces/package.interface';
import { formatDate, formatPrice } from '../../../../../Core/Utils/format.utils';
import { StatusBadgeComponent } from '../../Badges/status-badge/status-badge';
import { ButtonComponent } from '../../Buttons/button/button';
import { ModalComponent } from '../modal/modal';

@Component({
  selector: 'app-package-detail-modal',
  standalone: true,
  imports: [ModalComponent, StatusBadgeComponent, ButtonComponent],
  templateUrl: './package-detail-modal.html',
  styleUrl: './package-detail-modal.css',
})
export class PackageDetailModalComponent {
  @Input({ required: true }) item!: TravelPackage;
  @Output() closed = new EventEmitter<void>();
  @Output() edit = new EventEmitter<TravelPackage>();
  price(value: number): string {
    return formatPrice(value);
  }
  date(value: string): string {
    return formatDate(value);
  }
}
