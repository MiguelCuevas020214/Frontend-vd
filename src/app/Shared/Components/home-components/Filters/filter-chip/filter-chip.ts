import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-chip',
  standalone: true,
  templateUrl: './filter-chip.html',
  styleUrl: './filter-chip.css',
})
export class FilterChipComponent {
  @Input() label = '';
  @Input() active = false;
  @Input() removable = false;
  @Output() chipClick = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
}
