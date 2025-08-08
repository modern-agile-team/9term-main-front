export interface PostCreateFormData {
  groupId: number;
  title: string;
  content: string;
  postImage: File | null;
}

export interface Post {
  id: number;
  userId: number;
  groupId: number;
  title: string;
  content: string;
  postImageUrl: string | null;
  user: {
    name: string;
  };
  createdAt: string;
  updatedAt: string | null;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  isNotice: boolean; 
}

export interface GetPostsResponse {
  status: string;
  message: string;
  data: Post[];
}
