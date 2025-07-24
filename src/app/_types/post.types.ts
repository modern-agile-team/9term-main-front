export interface PostCreateFormData {
  groupId: number;
  title: string;
  content: string;
  postImg: File | null;
}

export interface Post {
  id: number;
  userId: number;
  groupId: number;
  title: string;
  content: string;
  postImg: string | null; // API 응답에서는 URL 문자열
  user: {
    name: string;
  };
  createdAt: string;
  updatedAt: string | null;
  likes: number;
  commentsCount: number;
  isNotice: boolean; // 공지 여부
}

export interface GetPostsResponse {
  status: string;
  message: string;
  data: Post[];
}
