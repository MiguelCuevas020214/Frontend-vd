import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { User } from '../../../../Core/Interfaces/user.interface';
import { AuthService } from '../../../../Core/Services/auth.service';
import { ToastService } from '../../../../Core/Services/toast.service';
import { UserService } from '../../../../Core/Services/user.service';
import { getErrorMessage } from '../../../../Core/Utils/format.utils';
import { StatusBadgeComponent } from '../../../../Shared/Components/home-components/Badges/status-badge/status-badge';
import { ButtonComponent } from '../../../../Shared/Components/home-components/Buttons/button/button';
import { SearchInputComponent } from '../../../../Shared/Components/home-components/Inputs/search-input/search-input';
import { ConfirmModalComponent } from '../../../../Shared/Components/home-components/Modals/confirm-modal/confirm-modal';
import { UserFormModalComponent } from '../../../../Shared/Components/home-components/Modals/user-form-modal/user-form-modal';

@Component({
  selector: 'app-users-view',
  standalone: true,
  imports: [
    StatusBadgeComponent,
    ButtonComponent,
    SearchInputComponent,
    ConfirmModalComponent,
    UserFormModalComponent,
  ],
  templateUrl: './users-view.html',
  styleUrl: './users-view.css',
})
export class UsersViewComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);
  readonly auth = inject(AuthService);
  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly query = signal('');
  readonly formOpen = signal(false);
  readonly selectedUser = signal<User | null>(null);
  readonly deleteUser = signal<User | null>(null);
  readonly deleting = signal(false);
  readonly filteredUsers = computed(() => {
    const search = this.query().toLowerCase().trim();
    return this.users().filter(
      (user) => !search || `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search),
    );
  });
  readonly ownerCount = computed(() => this.users().filter((user) => user.role === 'owner').length);
  readonly editorCount = computed(
    () => this.users().filter((user) => user.role === 'editor').length,
  );

  ngOnInit(): void {
    this.load();
  }
  load(): void {
    this.loading.set(true);
    this.userService.get().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.toast.error(getErrorMessage(error));
      },
    });
  }
  openCreate(): void {
    this.selectedUser.set(null);
    this.formOpen.set(true);
  }
  openEdit(user: User): void {
    this.selectedUser.set(user);
    this.formOpen.set(true);
  }
  onSaved(): void {
    this.formOpen.set(false);
    this.selectedUser.set(null);
    this.load();
  }
  askDelete(user: User): void {
    if (user.id === this.auth.user()?.id) {
      this.toast.show('No puedes eliminar la cuenta con la que iniciaste sesión.', 'warning');
      return;
    }
    this.deleteUser.set(user);
  }
  confirmDelete(): void {
    const user = this.deleteUser();
    if (!user) return;
    this.deleting.set(true);
    this.userService.delete(user.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deleteUser.set(null);
        this.toast.success('Usuario eliminado correctamente.');
        this.load();
      },
      error: (error: unknown) => {
        this.deleting.set(false);
        this.toast.error(getErrorMessage(error));
      },
    });
  }
}
