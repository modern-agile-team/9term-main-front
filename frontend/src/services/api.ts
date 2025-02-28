import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 로컬 개발 환경에서는 MSW가 이 경로를 가로챔
  headers: { "Content-Type": "application/json" },
});

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
