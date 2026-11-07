import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ButtonVariant =
  'primary' | 'action-blue' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'dashed';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class ButtonComponent {
  @Input() label = '';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() customClass = '';
  @Output() btnClick = new EventEmitter<MouseEvent>();

  get classes(): string {
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-blue-900 text-white shadow-sm hover:bg-blue-800',
      'action-blue': 'bg-sky-600 text-white shadow-sm hover:bg-sky-700',
      secondary: 'bg-amber-300 text-blue-950 shadow-sm hover:bg-amber-200',
      danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950',
      outline:
        'border border-slate-300 bg-white text-slate-700 hover:border-blue-700 hover:text-blue-900',
      dashed: 'border border-dashed border-blue-400 bg-blue-50/50 text-blue-800 hover:bg-blue-100',
    };
    const sizes: Record<ButtonSize, string> = {
      sm: 'min-h-9 px-4 py-2 text-xs',
      md: 'min-h-11 px-5 py-2.5 text-sm',
      lg: 'min-h-13 px-7 py-3.5 text-base',
    };
    return `inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100 ${variants[this.variant]} ${sizes[this.size]} ${this.fullWidth ? 'w-full' : ''} ${this.customClass}`;
  }
}
