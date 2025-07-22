import { QueryClient } from '@tanstack/react-query';

// 쿼리 키 상수
export const QUERY_KEYS = {
  comments: (groupId: number, postId: number) =>
    ['comments', groupId, postId] as const,
  post: (groupId: number, postId: number) => ['post', groupId, postId] as const,
  groupPosts: (groupId: number) => ['groupPosts', groupId] as const,
  groups: () => ['groups'] as const,
} as const;

// 댓글 관련 쿼리 무효화 유틸리티 함수
export const invalidateCommentRelatedQueries = (
  queryClient: QueryClient,
  groupId: number,
  postId: number
) => {
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.comments(groupId, postId),
  });
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.post(groupId, postId),
  });
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.groupPosts(groupId),
  });
};

// 게시글 관련 쿼리 무효화 유틸리티 함수
export const invalidatePostRelatedQueries = (
  queryClient: QueryClient,
  groupId: number
) => {
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.groupPosts(groupId),
  });
};
