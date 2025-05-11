import { mockUser } from '@/app/groups/[id]/mocks/data';

/**
 * 현재 로그인한 사용자 정보를 가져옵니다.
 * @throws {Error} API 요청 실패 시 에러를 던집니다.
 */
export const getCurrentUser = async () => {
  try {
    // 실제 API 호출 대신 목업 데이터 사용
    return mockUser;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    throw error;
  }
};
