export type UserRole = 'owner' | 'editor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface CreateUserDTO extends Omit<User, 'id' | 'createdAt'> {
  password: string;
}

export interface UpdateUserDTO extends Partial<Omit<CreateUserDTO, 'password'>> {
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginDTO {
  email: string;
  password: string;
}
