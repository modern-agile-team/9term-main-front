export interface User {
  id: number;
  name: string;
  userName: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}
