export interface User {
  id: number;
  userId: number;
  name: string;
  username: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
  profileImgUrl: string | null;
}
