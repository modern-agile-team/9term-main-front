import type { GetPostsResponse, Post } from '@/app/_types/post.types';
import { DeletePostResponse } from '@/app/_types/deletePostResponse';
import { get, post, patch, del } from './axios-client';
import { CreateLikeResponse } from '../_types/likes.types';

export const deletePost = async (
  groupId: number,
  postId: number
): Promise<DeletePostResponse> => {
  const res = await del<DeletePostResponse>(
    `/groups/${groupId}/posts/${postId}`
  );
  return res;
};

export const createPost = async (
  groupId: number,
  postData:
    | FormData
    | { title: string; content: string; postImage: File | null }
): Promise<Post | undefined> => {
  const res = await post<Post>(`/groups/${groupId}/posts`, postData);
  return res;
};

export const editPost = async (
  groupId: number,
  postId: number,
  postData: { title: string; content: string; category: string }
): Promise<Post | undefined> => {
  const res = await patch<Post>(`/groups/${groupId}/posts/${postId}`, postData);
  return res;
};

export const getGroupPosts = async (groupId: string): Promise<Post[]> => {
  const res = await get<GetPostsResponse>(`/groups/${groupId}/posts`);
  return res.data ?? [];
};

export const getPost = async (
  groupId: number,
  postId: number
): Promise<Post> => {
  return await get<Post>(`/groups/${groupId}/posts/${postId}`);
};

export const likePost = async (
  groupId: number,
  postId: number
): Promise<CreateLikeResponse> => {
  return await post<CreateLikeResponse>(
    `/groups/${groupId}/posts/${postId}/likes`
  );
};

export const unlikePost = async (
  groupId: number,
  postId: number
): Promise<CreateLikeResponse> => {
  return await del<CreateLikeResponse>(
    `/groups/${groupId}/posts/${postId}/likes`
  );
};
