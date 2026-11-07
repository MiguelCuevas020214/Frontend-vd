import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true,
    },
  ],
  templateUrl: './search-input.html',
  styleUrl: './search-input.css',
})
export class SearchInputComponent implements ControlValueAccessor {
  @Input() placeholder = 'Buscar…';
  @Input() label = 'Buscar';
  @Input() ngModel = '';
  @Output() ngModelChange = new EventEmitter<string>();

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
