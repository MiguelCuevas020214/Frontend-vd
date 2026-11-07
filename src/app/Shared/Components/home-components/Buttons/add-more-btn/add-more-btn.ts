import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-add-more-btn',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './add-more-btn.html',
  styleUrl: './add-more-btn.css',
})
export class AddMoreBtnComponent {
  @Input() label = 'Agregar otro';
  @Output() addClick = new EventEmitter<void>();
}
