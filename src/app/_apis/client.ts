import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { User } from '@/app/_types/user.types';
import type { GetPostsResponse, Post } from '@/app/_types/post.types';
//import type { GetGroupPostsResponse } from '@/app/_types/postcreate.types';
import type { GetGroupsResponse } from '@/app/_types/group.types';
import {
  Comment,
  GetCommentsResponse,
  CreateCommentRequest,
  CreateCommentResponse,
} from '@/app/_types/comment.types';

import { DeletePostResponse } from '../_types/deletePostResponse';
//import { CreategroupFormData } from '../_types/creategroup.types';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// API 클라이언트 기본 설정
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// API 요청 래퍼 함수
const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: defaultHeaders,
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const request = async <T>(
  config: Parameters<typeof apiClient.request>[0]
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get = async <T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>
): Promise<T> => {
  const url = new URL(endpoint, baseURL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return request<T>({
    method: 'GET',
    url: url.toString(),
  });
};

export const post = async <T>(endpoint: string, data?: unknown): Promise<T> => {
  return request<T>({
    method: 'POST',
    url: endpoint,
    data,
  });
};

export const put = async <T>(endpoint: string, data?: unknown): Promise<T> => {
  return request<T>({
    method: 'PUT',
    url: endpoint,
    data,
  });
};

export const patch = async <T>(
  endpoint: string,
  data?: unknown
): Promise<T> => {
  return request<T>({
    method: 'PATCH',
    url: endpoint,
    data,
  });
};

export const deleteRequest = async <T>(endpoint: string): Promise<T> => {
  const response = await apiClient.delete<T>(endpoint);
  return response.data;
};

export const getMyProfile = async (): Promise<User> => {
  const response = await apiClient.get<{
    status: string;
    message: string;
    data: User;
  }>('/users/me');

  return response.data.data;
};

export const deletePost = async (
  groupId: number,
  postId: number
): Promise<DeletePostResponse> => {
  const res = await deleteRequest<DeletePostResponse>(
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
  postData: { title: string; content: string }
): Promise<Post | undefined> => {
  const res = await patch<Post>(`/groups/${groupId}/posts/${postId}`, postData);
  return res;
};

export const getGroups = async (): Promise<GetGroupsResponse> => {
  const res = await get<GetGroupsResponse>(`/groups`);
  return res;
};

export const getGroup = async (groupId: number): Promise<any> => {
  const res = await get<any>(`/groups/${groupId}`);
  return res;
};
export const createGroup = async (
  formData:
    | FormData
    | { name: string; description: string; groupImage: File | null }
): Promise<GetGroupsResponse | undefined> => {
  const res = await post<GetGroupsResponse>(`/groups`, formData);
  return res;
};

export const updateGroup = async (
  groupId: number,
  formData: { name: string; description: string }
): Promise<GetGroupsResponse | undefined> => {
  const res = await patch<GetGroupsResponse>(`/groups/${groupId}`, formData);
  return res;
};

export const updateGroupImage = async (
  groupId: number,
  formData: FormData
): Promise<GetGroupsResponse | undefined> => {
  const res = await put<GetGroupsResponse>(
    `/groups/${groupId}/image`,
    formData
  );
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
  // 입력값 유효성 검사
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

  return await deleteRequest<void>(
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

export default apiClient;
