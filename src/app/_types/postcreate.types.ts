import type { Post } from './post.types';

export interface GetGroupPostsResponse {
  status: string;
  message: string;
  data?: Post[];
}

