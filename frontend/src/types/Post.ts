export interface Post {
  id: number;
  title: string;
  author: string;
  authorRole: string;
  content: string;
  location?: string;
  time?: string;
  tags: string[];
  likes: number;
  comments: number;
  saved: boolean;
}
