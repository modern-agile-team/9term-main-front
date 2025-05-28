export interface User {
  id: number;
  name: string;
  username: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}
