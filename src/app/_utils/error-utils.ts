import type { ApiErrorResponse } from '@/app/_types/comment.types';

// HTTP 상태 코드별 에러 메시지 매핑
const ERROR_MESSAGES = {
  400: '잘못된 요청입니다.',
  401: '로그인이 만료되었습니다. 다시 로그인해주세요.',
  403: '접근 권한이 없습니다.',
  404: '요청한 리소스를 찾을 수 없습니다.',
  409: '이미 존재하는 데이터입니다.',
  422: '입력 데이터가 올바르지 않습니다.',
  500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
} as const;

// 에러 응답에서 메시지 추출
const extractErrorMessage = (errorData: ApiErrorResponse): string => {
  if (Array.isArray(errorData.message)) {
    return errorData.message.join(', ');
  }
  return errorData.message || '알 수 없는 오류가 발생했습니다.';
};

// HTTP 상태 코드별 에러 처리
export const handleApiError = (
  errorData: ApiErrorResponse,
  customMessages?: Partial<typeof ERROR_MESSAGES>
): string => {
  const statusCode = errorData.statusCode;
  const messages = { ...ERROR_MESSAGES, ...customMessages };

  // 401 에러는 인터셉터에서 처리되므로 여기서는 메시지만 반환
  if (statusCode === 401) {
    return messages[401];
  }

  // 400 에러는 서버에서 전달된 구체적인 메시지 사용
  if (statusCode === 400) {
    const extractedMessage = extractErrorMessage(errorData);
    return `입력 오류: ${extractedMessage}`;
  }

  // 기타 상태 코드는 기본 메시지 사용
  if (statusCode in messages) {
    return messages[statusCode as keyof typeof ERROR_MESSAGES];
  }

  // 알 수 없는 상태 코드
  return extractErrorMessage(errorData);
};

// 네트워크 에러 처리
export const handleNetworkError = (): string => {
  return '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
};

// 일반적인 에러 처리 (AxiosError 등)
export const handleGeneralError = (error: any): string => {
  if (error?.response?.data) {
    return handleApiError(error.response.data);
  }

  if (error?.message) {
    return error.message;
  }

  return handleNetworkError();
};
