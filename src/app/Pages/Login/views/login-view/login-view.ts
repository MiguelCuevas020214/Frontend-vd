import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginDTO } from '../../../../Core/Interfaces/user.interface';
import { AuthService } from '../../../../Core/Services/auth.service';
import { ToastService } from '../../../../Core/Services/toast.service';
import { getErrorMessage } from '../../../../Core/Utils/format.utils';
import { AuthButtonComponent } from '../../../../Shared/Components/auth-components/Buttons/auth-button/auth-button';
import { AuthCardComponent } from '../../../../Shared/Components/auth-components/Cards/auth-card/auth-card';
import { PasswordInputComponent } from '../../../../Shared/Components/auth-components/Inputs/password-input/password-input';
import { InputFieldComponent } from '../../../../Shared/Components/home-components/Inputs/input-field/input-field';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [
    FormsModule,
    AuthButtonComponent,
    AuthCardComponent,
    PasswordInputComponent,
    InputFieldComponent,
  ],
  templateUrl: './login-view.html',
  styleUrl: './login-view.css',
})
export class LoginViewComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  readonly credentials: LoginDTO = { email: '', password: '' };
  readonly loading = signal(false);
  readonly error = signal('');

  submit(): void {
    this.error.set('');
    if (!this.credentials.email.trim() || !this.credentials.password) {
      this.error.set('Ingresa tu correo y contraseña para continuar.');
      return;
    }
    this.loading.set(true);
    this.auth.login(this.credentials).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.toast.success(`¡Hola, ${response.user.name.split(' ')[0]}! Bienvenido al panel.`);
        void this.router.navigate(['/panel']);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.error.set(getErrorMessage(error));
      },
    });
  }

  setEmail(value: string | number | null): void {
    this.credentials.email = String(value ?? '');
  }

  useDemo(role: 'owner' | 'editor'): void {
    this.credentials.email =
      role === 'owner' ? 'owner@viajedirecto.com' : 'editor@viajedirecto.com';
    this.credentials.password = role === 'owner' ? 'Admin123*' : 'Editor123*';
    this.error.set('');
  }
}
