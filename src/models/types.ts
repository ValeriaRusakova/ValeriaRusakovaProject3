export type Role = 'user' | 'admin';

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Role;
  created_at?: Date;
}

export interface JwtUserPayload {
  id: number;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthRegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthLoginBody {
  email: string;
  password: string;
}
