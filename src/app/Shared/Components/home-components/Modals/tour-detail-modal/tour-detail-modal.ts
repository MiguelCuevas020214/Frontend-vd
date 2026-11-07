import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tour } from '../../../../../Core/Interfaces/tour.interface';
import { formatPrice } from '../../../../../Core/Utils/format.utils';
import { StatusBadgeComponent } from '../../Badges/status-badge/status-badge';
import { ButtonComponent } from '../../Buttons/button/button';
import { ModalComponent } from '../modal/modal';

@Component({
  selector: 'app-tour-detail-modal',
  standalone: true,
  imports: [ModalComponent, StatusBadgeComponent, ButtonComponent],
  templateUrl: './tour-detail-modal.html',
  styleUrl: './tour-detail-modal.css',
})
export class TourDetailModalComponent {
  @Input({ required: true }) tour!: Tour;
  @Output() closed = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Tour>();
  price(value: number): string {
    return formatPrice(value);
  }
}
