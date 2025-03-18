// API 클라이언트 기본 설정
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const defaultHeaders = {
  "Content-Type": "application/json",
};

// 토큰 가져오기
const getToken = () => localStorage.getItem("token");

// API 요청 래퍼 함수
export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${baseURL}${endpoint}`;

    try {
      // 토큰이 있다면 헤더에 추가
      const token = getToken();
      const headers = {
        ...defaultHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // 401 에러 처리 (인증 실패)
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        throw error;
      }
      console.error("API 요청 실패:", error);
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
  return apiClient.post("/login", { username, password });
};

// 유저 정보 가져오기
export const getUser = async () => {
  return apiClient.get("/user");
};

// 게시물 리스트 가져오기
export const getPosts = async () => {
  return apiClient.get("/posts");
};
