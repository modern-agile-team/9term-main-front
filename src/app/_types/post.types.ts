export interface Post {
  id: number;
  userId: number;
  groupId: number;
  title: string;
  content: string;
  author?: {
    id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string | null;
  category?: '공지' | '자유게시판' | '일정' | '통계'; // 게시글 카테고리(탭)
  location?: string;
  time?: string;
  tags?: string[];
  likes?: number;
  comments?: number;
  saved?: boolean;
  isNotice?: boolean; // 공지 여부
}

export interface GetPostsResponse {
  status: string;
  message: string;
  data: Post[];
}
