import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-row',
  standalone: true,
  templateUrl: './form-row.html',
  styleUrl: './form-row.css',
})
export class FormRowComponent {
  @Input() label = '';
  @Input() hint = '';
  @Input() required = false;
}
