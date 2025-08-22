// API 에러 응답 타입
export interface ApiErrorResponse {
  message: string;
  status?: number;
  code?: string;
}

// 확장된 Error 타입
export interface ApiError extends Error {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
  };
}
