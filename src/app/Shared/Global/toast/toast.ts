import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  signal,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent implements OnChanges, OnDestroy {
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'success';
  @Input() trigger = 0;
  readonly visible = signal(false);
  readonly leaving = signal(false);
  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);
  private hideTimer?: ReturnType<typeof setTimeout>;
  private removeTimer?: ReturnType<typeof setTimeout>;

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['trigger'] || changes['message']) && this.message) {
      afterNextRender(() => this.present(), { injector: this.injector });
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  dismiss(): void {
    if (!this.visible()) return;
    this.leaving.set(true);
    this.removeTimer = setTimeout(() => {
      this.visible.set(false);
      this.leaving.set(false);
    }, 300);
  }

  get icon(): string {
    return { success: '✓', error: '!', warning: '⚠', info: 'i' }[this.type];
  }

  private present(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.clearTimers();
    this.leaving.set(false);
    this.visible.set(true);
    this.hideTimer = setTimeout(() => this.dismiss(), 4000);
  }

  private clearTimers(): void {
    if (this.hideTimer) clearTimeout(this.hideTimer);
    if (this.removeTimer) clearTimeout(this.removeTimer);
  }
}
