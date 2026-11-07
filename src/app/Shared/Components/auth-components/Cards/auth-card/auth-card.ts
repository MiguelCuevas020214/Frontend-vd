import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-card',
  standalone: true,
  templateUrl: './auth-card.html',
  styleUrl: './auth-card.css',
})
export class AuthCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
