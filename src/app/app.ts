import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './Core/Services/toast.service';
import { ToastComponent } from './Shared/Global/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly toast = inject(ToastService);
}
