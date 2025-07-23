export interface User {
  id?: number;
  name: string;
  userName: string;
  username?: string;
  role?: 'USER' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

