import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-sidebar',
  standalone: true,
  templateUrl: './button-sidebar.html',
  styleUrl: './button-sidebar.css',
})
export class ButtonSidebarComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() active = false;
  @Input() disabled = false;
  @Output() btnClick = new EventEmitter<MouseEvent>();
}
