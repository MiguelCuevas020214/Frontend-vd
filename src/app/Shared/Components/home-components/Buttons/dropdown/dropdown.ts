import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ClickOutsideDirective } from '../../Directives/click-outside.directive';

export interface DropdownItem {
  id: string;
  label: string;
  danger?: boolean;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [ClickOutsideDirective],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
})
export class DropdownComponent {
  @Input() items: DropdownItem[] = [];
  @Input() label = 'Abrir menú';
  @Output() itemClick = new EventEmitter<DropdownItem>();
  isOpen = false;

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.isOpen = false;
  }

  select(item: DropdownItem): void {
    this.itemClick.emit(item);
    this.isOpen = false;
  }
}
