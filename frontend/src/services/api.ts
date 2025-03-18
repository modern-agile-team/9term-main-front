// API 요청 디버깅을 위한 유틸리티 함수
const logRequest = (method: string, url: string) => {
  console.log("API 요청:", method.toUpperCase(), url);
};

const logResponse = (status: number, url: string) => {
  console.log("API 응답:", status, url);
};

const logError = (error: Error | unknown, url?: string) => {
  console.error("API 오류:", error, url);
};

// 기본 API 설정
const baseURL = "/api"; // 로컬 개발 환경에서는 MSW가 이 경로를 가로챔
const defaultHeaders = {
  "Content-Type": "application/json",
};

// API 요청 래퍼 함수
const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${baseURL}${endpoint}`;
    const method = options.method || "GET";

    try {
      logRequest(method, url);

      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      logResponse(response.status, url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      logError(error, url);
      throw error;
    }
  },

  get(endpoint: string) {
    return this.request(endpoint);
  },

  post(endpoint: string, data: unknown) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: unknown) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  },
};

// 로그인 API 호출
export const login = async (username: string, password: string) => {
  return api.post("/login", { username, password });
};

// 유저 정보 가져오기
export const getUser = async () => {
  return api.get("/user");
};

// 게시물 리스트 가져오기
export const getPosts = async () => {
  return api.get("/posts");
};

export default api;
