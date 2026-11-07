import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../../Buttons/button/button';
import { ModalComponent } from '../modal/modal';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
})
export class ConfirmModalComponent {
  @Input() title = '¿Confirmar acción?';
  @Input() message = 'Esta acción no se puede deshacer.';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() theme: 'danger' | 'success' | 'primary' = 'danger';
  @Input() loading = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get icon(): string {
    return this.theme === 'danger' ? '!' : this.theme === 'success' ? '✓' : '?';
  }
}
