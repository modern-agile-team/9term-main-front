import axios from "axios";

// API 요청 디버깅을 위한 인터셉터 추가
const api = axios.create({
  baseURL: "/api", // 로컬 개발 환경에서는 MSW가 이 경로를 가로챔
  headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    console.log("API 요청:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("API 요청 오류:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => {
    console.log("API 응답:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "API 응답 오류:",
      error.response?.status,
      error.config?.url,
      error.message
    );
    return Promise.reject(error);
  }
);

// 로그인 API 호출
export const login = async (username: string, password: string) => {
  const response = await api.post("/login", { username, password });
  return response.data;
};

// 유저 정보 가져오기
export const getUser = async () => {
  const response = await api.get("/user");
  return response.data;
};

// 게시물 리스트 가져오기
export const getPosts = async () => {
  const response = await api.get("/posts");
  return response.data;
};

export default api;
