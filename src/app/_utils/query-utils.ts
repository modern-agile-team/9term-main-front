import { QueryClient } from '@tanstack/react-query';

// 쿼리 키 상수 (계층적 구조)
export const QUERY_KEYS = {
  // 프로필 관련
  myProfile: () => ['myProfile'] as const,
  // 그룹 관련
  groups: () => ['groups'] as const,
  group: (groupId: number) => ['group', groupId] as const,
  // 그룹 > 멤버
  groupMembers: (groupId: number) => ['group', groupId, 'members'] as const,

  // 그룹 > 게시글
  groupPosts: (groupId: number) => ['group', groupId, 'posts'] as const,

  // 그룹 > 게시글 > 특정 게시글
  post: (groupId: number, postId: number) =>
    ['group', groupId, 'posts', postId] as const,

  // 그룹 > 게시글 > 특정 게시글 > 댓글
  comments: (groupId: number, postId: number) =>
    ['group', groupId, 'posts', postId, 'comments'] as const,
  
  // 그룹 > 게시글 > 특정 게시글 > 대댓글
  replies: (groupId: number, postId: number) =>
    ['replies', groupId, postId] as const,
} as const;

// 댓글 관련 쿼리 무효화 유틸리티 함수
export const invalidateCommentRelatedQueries = (
  queryClient: QueryClient,
  groupId: number,
  postId: number
) => {
  // 부모댓글 목록 무효화
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.comments(groupId, postId),
  });
  
  // 모든 대댓글 쿼리 무효화 (replies로 시작하는 모든 쿼리)
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.replies(groupId, postId),
  });
  
  // 게시글 정보도 무효화 (댓글 수 업데이트)
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
  // 부모댓글 목록 무효화
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.comments(groupId, postId),
  });
  
  // 모든 대댓글 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.replies(groupId, postId),
  });
  
  // 게시글 정보도 무효화 (댓글 수 업데이트)
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
  // 부모댓글 목록 무효화
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.comments(groupId, postId),
  });
  
  // 모든 대댓글 쿼리 무효화
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.replies(groupId, postId),
  });
  
  // 게시글 정보도 무효화
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.post(groupId, postId),
  });
};

// 그룹 관련 쿼리 무효화 유틸리티 함수
export const invalidateGroupRelatedQueries = (
  queryClient: QueryClient,
  groupId: number
) => {
  // 모든 그룹 목록 무효화
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.groups(),
  });
  
  // 특정 그룹 정보 무효화
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.group(groupId),
  });
  
  // 그룹 멤버 목록 무효화
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.groupMembers(groupId),
  });
  
  // 그룹 게시글 목록 무효화
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.groupPosts(groupId),
  });
};
