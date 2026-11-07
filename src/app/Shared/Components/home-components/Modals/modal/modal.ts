import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class ModalComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() maxWidth = 'max-w-4xl';
  @Input() maxHeight = 'max-h-[90vh]';
  @Input() showHeader = true;
  @Input() showCloseButton = true;
  @Input() bodyClass = 'p-5 sm:p-6';
  @Input() overlayClass = '';
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;
  @Output() onClose = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.closeOnEscape) this.requestClose();
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop && event.target === event.currentTarget) this.requestClose();
  }

  requestClose(): void {
    this.onClose.emit();
    this.close.emit();
  }
}
