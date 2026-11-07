import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal('');
  readonly type = signal<ToastType>('success');
  readonly trigger = signal(0);

  show(message: string, type: ToastType = 'success'): void {
    this.message.set(message);
    this.type.set(type);
    this.trigger.update((value) => value + 1);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }
}
