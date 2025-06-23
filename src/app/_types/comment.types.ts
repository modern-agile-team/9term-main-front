export interface Comment {
  id: number;
  content: string;
  user: {
    name: string;
    profileImageUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
  children?: Comment[];
}

export interface GetCommentsResponse {
  status: string;
  message: string;
  data: Comment[];
}
