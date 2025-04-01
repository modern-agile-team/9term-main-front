import { mockClubs } from '@/mocks/data'

export const getClubs = async () => {
  try {
    // 실제 API 호출 대신 목업 데이터 사용
    return mockClubs
  } catch (error) {
    console.error('Failed to fetch clubs:', error)
    throw error
  }
} 