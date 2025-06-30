export interface Comment {
  id: number;
  parentId: number | null;
  content: string;
  user: {
    name: string;
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

export interface CreateCommentRequest {
  groupId: string;
  authorId: string;
  title: string;
  content: string;
}

export interface CreateCommentResponse {
  postId: string;
  message: string;
}
