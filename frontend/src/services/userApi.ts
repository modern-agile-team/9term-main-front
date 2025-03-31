import { apiClient } from '@/lib/api/client'
import type { User } from '@/types/user'

/**
 * 현재 로그인한 사용자 정보를 가져옵니다.
 * @throws {Error} API 요청 실패 시 에러를 던집니다.
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const { data } = await apiClient.get('/api/user')
    return data as User
  } catch (error) {
    // 개발 환경에서만 로그 출력
    if (process.env.NODE_ENV === 'development') {
      console.error('[UserAPI] 사용자 정보 요청 실패:', error)
    }
    throw new Error('사용자 정보를 가져오는데 실패했습니다.')
  }
}
