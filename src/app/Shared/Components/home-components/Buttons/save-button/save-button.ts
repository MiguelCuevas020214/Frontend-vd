import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-save-button',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './save-button.html',
  styleUrl: './save-button.css',
})
export class SaveButtonComponent {
  @Input() label = 'Guardar';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Output() saveClick = new EventEmitter<MouseEvent>();
}
