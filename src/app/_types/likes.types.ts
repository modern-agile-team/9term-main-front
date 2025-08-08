export interface Like {
  id: number;
  userId: number;
  postId: number;
  groupId: number;
  user: {
    name: string;
  };
}

export interface GetLikesResponse {
  status: string;
  data: {
    isLiked: boolean;
  };
}

export interface CreateLikeRequest {
  postId: number;
  groupId: number;
}
export interface CreateLikeResponse {
  status: string;
  data: {
    isLiked: boolean;
  };
}
export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}
