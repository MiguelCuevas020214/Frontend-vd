import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CreateUserDTO,
  UpdateUserDTO,
  User,
  UserRole,
} from '../../../../../Core/Interfaces/user.interface';
import { ToastService } from '../../../../../Core/Services/toast.service';
import { UserService } from '../../../../../Core/Services/user.service';
import { getErrorMessage } from '../../../../../Core/Utils/format.utils';
import { PasswordInputComponent } from '../../../auth-components/Inputs/password-input/password-input';
import { ButtonComponent } from '../../Buttons/button/button';
import { SaveButtonComponent } from '../../Buttons/save-button/save-button';
import { InputFieldComponent } from '../../Inputs/input-field/input-field';
import { SelectComponent, SelectValue } from '../../Inputs/select/select';
import { ModalComponent } from '../modal/modal';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [
    FormsModule,
    ModalComponent,
    ButtonComponent,
    SaveButtonComponent,
    InputFieldComponent,
    PasswordInputComponent,
    SelectComponent,
  ],
  templateUrl: './user-form-modal.html',
  styleUrl: './user-form-modal.css',
})
export class UserFormModalComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() saved = new EventEmitter<User>();
  @Output() cancelled = new EventEmitter<void>();
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);
  form: CreateUserDTO = { name: '', email: '', role: 'editor', active: true, password: '' };
  readonly saving = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    if (this.user)
      this.form = {
        name: this.user.name,
        email: this.user.email,
        role: this.user.role,
        active: this.user.active,
        password: '',
      };
  }
  setRole(value: SelectValue | null): void {
    this.form.role = (value === 'owner' ? 'owner' : 'editor') as UserRole;
  }
  setActive(value: SelectValue | null): void {
    this.form.active = value !== 'inactive';
  }

  save(): void {
    this.error.set('');
    if (!this.form.name.trim() || !/^\S+@\S+\.\S+$/.test(this.form.email)) {
      this.error.set('Ingresa un nombre y un correo electrónico válido.');
      return;
    }
    if (!this.user && this.form.password.length < 8) {
      this.error.set('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (this.form.password && this.form.password.length < 8) {
      this.error.set('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    this.saving.set(true);
    const request = this.user
      ? this.userService.update(this.user.id, this.updatePayload())
      : this.userService.create(this.form);
    request.subscribe({
      next: (user) => {
        this.saving.set(false);
        this.toast.success(
          this.user ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.',
        );
        this.saved.emit(user);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(getErrorMessage(error));
        this.toast.error('No pudimos guardar el usuario.');
      },
    });
  }

  private updatePayload(): UpdateUserDTO {
    const payload: UpdateUserDTO = {
      name: this.form.name,
      email: this.form.email,
      role: this.form.role,
      active: this.form.active,
    };
    if (this.form.password) payload.password = this.form.password;
    return payload;
  }
}
