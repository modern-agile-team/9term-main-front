import axios from "axios";

// API 클라이언트 기본 설정
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 처리 (인증 실패)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // 로그인 페이지로 리다이렉트
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// 로그인 API 호출
export const login = async (username: string, password: string) => {
  const response = await apiClient.post("/login", { username, password });
  return response.data;
};

// 유저 정보 가져오기
export const getUser = async () => {
  const response = await apiClient.get("/user");
  return response.data;
};

// 게시물 리스트 가져오기
export const getPosts = async () => {
  const response = await apiClient.get("/posts");
  return response.data;
};
