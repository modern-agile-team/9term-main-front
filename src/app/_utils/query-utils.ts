import { QueryClient } from '@tanstack/react-query';

// 쿼리 키 상수 (계층적 구조)
export const QUERY_KEYS = {
  // 그룹 관련
  groups: () => ['groups'] as const,

  // 그룹 > 게시글
  groupPosts: (groupId: number) => ['group', groupId, 'posts'] as const,

  // 그룹 > 게시글 > 특정 게시글
  post: (groupId: number, postId: number) =>
    ['group', groupId, 'posts', postId] as const,

  // 그룹 > 게시글 > 특정 게시글 > 댓글
  comments: (groupId: number, postId: number) =>
    ['group', groupId, 'posts', postId, 'comments'] as const,
} as const;

// 댓글 관련 쿼리 무효화 유틸리티 함수
export const invalidateCommentRelatedQueries = (
  queryClient: QueryClient,
  groupId: number,
  postId: number
) => {
  // 계층적 구조로 인해 게시글 쿼리만 무효화하면 댓글도 자동으로 무효화됨
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.post(groupId, postId),
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

// 댓글 삭제 후 쿼리 무효화 유틸리티 함수
export const invalidateCommentDeleteQueries = (
  queryClient: QueryClient,
  groupId: number,
  postId: number
) => {
  // 계층적 구조로 인해 게시글 쿼리만 무효화하면 댓글도 자동으로 무효화됨
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.post(groupId, postId),
  });
};

// 댓글 수정 후 쿼리 무효화 유틸리티 함수
export const invalidateCommentUpdateQueries = (
  queryClient: QueryClient,
  groupId: number,
  postId: number
) => {
  // 계층적 구조로 인해 게시글 쿼리만 무효화하면 댓글도 자동으로 무효화됨
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.post(groupId, postId),
  });
};
