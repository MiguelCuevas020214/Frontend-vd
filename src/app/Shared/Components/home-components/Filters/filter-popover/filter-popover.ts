import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ClickOutsideDirective } from '../../Directives/click-outside.directive';

@Component({
  selector: 'app-filter-popover',
  standalone: true,
  imports: [ClickOutsideDirective],
  templateUrl: './filter-popover.html',
  styleUrl: './filter-popover.css',
})
export class FilterPopoverComponent {
  @Input() title = 'Filtros';
  @Input() activeCount = 0;
  @Output() clear = new EventEmitter<void>();
  @Output() apply = new EventEmitter<void>();
  isOpen = false;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isOpen = false;
  }

  applyFilters(): void {
    this.apply.emit();
    this.isOpen = false;
  }
}
