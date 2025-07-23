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
  content: string;
  parentId?: number | null;
}

export interface CreateCommentResponse {
  status: string;
  message: string;
  data: object;
}

export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}
