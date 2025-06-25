import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { User } from '@/app/_types/user.types';
import type { Post } from '@/app/_types/post.types';
import type { GetGroupPostsResponse } from '@/app/_types/postcreate.types';
import { Comment, GetCommentsResponse } from '@/app/_types/comment.types';

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
    // 인터셉터에서 401 에러를 처리하므로 여기서는 단순히 에러를 던집니다
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

export const getMyProfile = async (token?: string | null): Promise<User> => {
  const finaltoken =
    token ??
    (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  if (!finaltoken) {
    throw new Error('No token');
  }

  const response = await apiClient.get<{
    status: string;
    message: string;
    data: User;
  }>('/users/me');

  return response.data.data;
};

export const createPost = async (
  groupId: string,
  postData: { title: string; content: string }
): Promise<Post | undefined> => {
  const res = await post<Post>(`/groups/${groupId}/posts`, postData);
  return res;
};

export const getGroupPosts = async (groupId: string): Promise<Post[]> => {
  const res = await get<GetGroupPostsResponse>(`/groups/${groupId}/posts`);
  return res.data ?? [];
};

export const getPost = async (
  groupId: string,
  postId: string
): Promise<Post> => {
  return await get<Post>(`/groups/${groupId}/posts/${postId}`);
};

export const getComments = async (
  groupId: string,
  postId: string,
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

export default apiClient;
