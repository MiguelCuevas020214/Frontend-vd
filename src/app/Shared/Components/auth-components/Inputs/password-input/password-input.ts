import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
  templateUrl: './password-input.html',
  styleUrl: './password-input.css',
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() inputId = 'password';
  @Input() label = 'Contraseña';
  @Input() placeholder = 'Tu contraseña';
  @Input() error = '';
  @Input() autocomplete = 'current-password';
  @Input() ngModel = '';
  @Output() ngModelChange = new EventEmitter<string>();
  visible = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.ngModel = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(_disabled: boolean): void {}

  update(value: string): void {
    this.ngModel = value;
    this.ngModelChange.emit(value);
    this.onChange(value);
    this.onTouched();
  }
}
