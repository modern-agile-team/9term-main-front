export interface PostCreateFormData {
  groupId: number;
  title: string;
  content: string;
  postImage: File | null;
  category: string;
}

export interface Post {
  id: number;
  userId: number;
  groupId: number;
  title: string;
  content: string;
  postImageUrl: string | null;
  category: string;
  user: {
    name: string;
    profileImageUrl: string | null;
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
