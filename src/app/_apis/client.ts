import axios, { AxiosInstance, AxiosResponse } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

// API 클라이언트 기본 설정
const defaultHeaders = {
  'Content-Type': 'application/json',
}

// API 요청 래퍼 함수
export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: defaultHeaders,
})

export const request = async <T>(
  config: Parameters<typeof apiClient.request>[0]
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.request(config)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    throw error
  }
}

export const get = async <T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>
): Promise<T> => {
  const url = new URL(endpoint, baseURL)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  return request<T>({
    method: 'GET',
    url: url.toString(),
  })
}

export const post = async <T>(endpoint: string, data?: unknown): Promise<T> => {
  return request<T>({
    method: 'POST',
    url: endpoint,
    data,
  })
}

export const put = async <T>(endpoint: string, data?: unknown): Promise<T> => {
  return request<T>({
    method: 'PUT',
    url: endpoint,
    data,
  })
}

export const patch = async <T>(
  endpoint: string,
  data?: unknown
): Promise<T> => {
  return request<T>({
    method: 'PATCH',
    url: endpoint,
    data,
  })
}

export const deleteRequest = async <T>(endpoint: string): Promise<T> => {
  const response = await apiClient.delete<T>(endpoint)
  return response.data
}

// 로그인 API 호출
export const login = async (email: string, password: string) => {
  return post<ApiResponse<{ token: string }>>('/api/login', { email, password })
}

// 유저 정보 가져오기
export const getUser = async () => {
  return get<ApiResponse<{ id: number; name: string; email: string }>>(
    '/api/user'
  )
}

// 게시물 리스트 가져오기
export const getPosts = async () => {
  return get('/api/posts')
}

export default apiClient
