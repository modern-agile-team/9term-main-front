import { apiClient } from '@/lib/api/client'
import type { Post } from '@/types/Post'

// 모임 게시글 목록 가져오기
export const getCommunityPosts = async (tag?: string): Promise<Post[]> => {
  const params = tag && tag !== '전체' ? { tag } : undefined
  try {
    const { data } = await apiClient.get<Post[]>('/api/posts', { params })
    return data
  } catch (error) {
    console.error('커뮤니티 게시글 요청 실패:', error)
    throw error
  }
}

// 특정 게시글 가져오기
export const getCommunityPost = async (id: number) => {
  const response = await apiClient.get(`/posts/${id}`)
  return response.data as Post
}

// 게시글 작성하기
export const createCommunityPost = async (postData: Partial<Post>) => {
  const response = await apiClient.post('/posts', postData)
  return response.data as Post
}

// 게시글 좋아요 토글
export const togglePostLike = async (id: number) => {
  const response = await apiClient.patch(`/posts/${id}/like`, {})
  return response.data as { liked: boolean }
}

// 게시글 저장 토글
export const togglePostSave = async (id: number) => {
  const response = await apiClient.patch(`/posts/${id}/save`, {})
  return response.data as { saved: boolean }
}
