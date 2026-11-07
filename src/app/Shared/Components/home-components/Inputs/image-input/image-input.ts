import { Component, EventEmitter, Input, Output } from '@angular/core';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

@Component({
  selector: 'app-image-input',
  standalone: true,
  templateUrl: './image-input.html',
  styleUrl: './image-input.css',
})
export class ImageInputComponent {
  @Input() label = 'Imagen';
  @Input() preview = '';
  @Input() required = false;
  @Output() imageChange = new EventEmitter<string>();
  @Output() fileChange = new EventEmitter<File>();
  error = '';
  dragging = false;
  inputId = `image-${Math.random().toString(36).slice(2, 9)}`;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
    input.value = '';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  clear(): void {
    this.preview = '';
    this.error = '';
    this.imageChange.emit('');
  }

  private processFile(file: File): void {
    this.error = '';
    if (!ALLOWED_TYPES.includes(file.type)) {
      this.error = 'Usa una imagen JPG, PNG o WebP.';
      return;
    }
    if (file.size > MAX_SIZE) {
      this.error = 'La imagen no puede superar los 5 MB.';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = String(reader.result);
      this.imageChange.emit(this.preview);
      this.fileChange.emit(file);
    };
    reader.onerror = () => (this.error = 'No pudimos leer la imagen. Inténtalo nuevamente.');
    reader.readAsDataURL(file);
  }
}
