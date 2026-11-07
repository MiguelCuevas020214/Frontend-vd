import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export type SelectValue = string | number | boolean;
export type SelectOptionInput = SelectValue | { label: string; value: SelectValue };
export interface SelectOption {
  label: string;
  value: SelectValue;
}
let nextId = 0;

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  templateUrl: './select.html',
  styleUrl: './select.css',
})
export class SelectComponent implements ControlValueAccessor {
  readonly String = String;
  @Input() selectId = `app-select-${nextId++}`;
  @Input() label = '';
  @Input() placeholder = 'Selecciona una opción';
  @Input() options: SelectOptionInput[] = [];
  @Input() disabled = false;
  @Input() required = false;
  @Input() error = '';
  @Input() ngModel: SelectValue | null = null;
  @Output() ngModelChange = new EventEmitter<SelectValue | null>();
  @Output() valueChange = new EventEmitter<SelectValue | null>();

  private onChange: (value: SelectValue | null) => void = () => {};
  private onTouched: () => void = () => {};

  get normalizedOptions(): SelectOption[] {
    return this.options.map((option) =>
      typeof option === 'object' ? option : { label: String(option), value: option },
    );
  }

  writeValue(value: SelectValue | null): void {
    this.ngModel = value;
  }

  registerOnChange(fn: (value: SelectValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  update(rawValue: string): void {
    const option = this.normalizedOptions.find((item) => String(item.value) === rawValue);
    const value = option?.value ?? null;
    this.ngModel = value;
    this.ngModelChange.emit(value);
    this.valueChange.emit(value);
    this.onChange(value);
    this.onTouched();
  }
}
