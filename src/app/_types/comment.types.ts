export interface Comment {
  id: number;
  content: string;
  author: {
    nickname: string;
    profileImageUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  children?: Comment[];
}
