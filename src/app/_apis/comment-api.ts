import {
  Comment,
  GetCommentsResponse,
  CreateCommentRequest,
  CreateCommentResponse,
} from '@/app/_types/comment.types';
import { get, post, patch, del } from './axios-client';

export const getComments = async (
  groupId: number,
  postId: number,
  parentId?: number
): Promise<Comment[]> => {
  const params: Record<string, string | number> = {};
  if (parentId) {
    params.parentId = parentId;
  }
  const res = await get<GetCommentsResponse>(
    `/groups/${groupId}/posts/${postId}/comments`,
    params
  );
  return res.data;
};

export const createComment = async (
  groupId: number,
  postId: number,
  commentData: CreateCommentRequest
): Promise<CreateCommentResponse> => {
  if (!groupId || !postId) {
    throw new Error('groupId와 postId가 필요합니다.');
  }

  return await post<CreateCommentResponse>(
    `/groups/${groupId}/posts/${postId}/comments`,
    commentData
  );
};

export const deleteComment = async (
  groupId: number,
  postId: number,
  commentId: number
): Promise<void> => {
  // 입력값 유효성 검사
  if (!groupId || !postId || !commentId) {
    throw new Error('groupId, postId, commentId가 필요합니다.');
  }

  return await del<void>(
    `/groups/${groupId}/posts/${postId}/comments/${commentId}`
  );
};

export const updateComment = async (
  groupId: number,
  postId: number,
  commentId: number,
  commentData: { content: string }
): Promise<Comment> => {
  // 입력값 유효성 검사
  if (!groupId || !postId || !commentId) {
    throw new Error('groupId, postId, commentId가 필요합니다.');
  }

  return await patch<Comment>(
    `/groups/${groupId}/posts/${postId}/comments/${commentId}`,
    commentData
  );
};
