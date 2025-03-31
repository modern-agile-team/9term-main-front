export interface Post {
  id: number;
  title: string;
  content: string;
  author?: {
    id: number;
    username: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
