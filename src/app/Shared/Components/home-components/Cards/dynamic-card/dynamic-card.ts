import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatusBadgeComponent } from '../../Badges/status-badge/status-badge';

@Component({
  selector: 'app-dynamic-card',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent],
  templateUrl: './dynamic-card.html',
  styleUrl: './dynamic-card.css',
})
export class DynamicCardComponent {
  @Input() image = '';
  @Input() imageAlt = '';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() description = '';
  @Input() meta = '';
  @Input() price = '';
  @Input() priceLabel = 'desde';
  @Input() badges: string[] = [];
  @Input() link: string | null = null;
  @Input() ctaLabel = 'Descubrir viaje';
  @Output() cardClick = new EventEmitter<void>();
}
