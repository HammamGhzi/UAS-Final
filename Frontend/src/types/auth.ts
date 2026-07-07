export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export type User = {
  id: number;
  email: string;
  role: Role;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};