import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../../../home-components/Buttons/button/button';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './auth-button.html',
  styleUrl: './auth-button.css',
})
export class AuthButtonComponent {
  @Input() label = 'Ingresar';
  @Input() loading = false;
  @Input() disabled = false;
  @Output() authClick = new EventEmitter<MouseEvent>();
}
