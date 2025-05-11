"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";

// 사용자 정보 타입 정의
export interface User {
  id: string;
  name?: string;
  email?: string;
  // 기타 필요한 필드
}

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
  token: string | null;
}

// 사용자 정보 가져오는 API 함수
const fetchUserProfile = async (): Promise<User> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("인증 토큰이 없습니다.");
  }

  const response = await fetch("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("사용자 정보를 가져오는데 실패했습니다.");
  }

  return response.json();
};

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 인증 Provider 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  // 로컬 스토리지에서 토큰 가져오기
  const [token, setToken] = useState<string | null>(null);
  const [_userId, setUserId] = useState<string | null>(null);

  // 초기 로드 시 로컬 스토리지에서 토큰 가져오기
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // 사용자 정보 쿼리 - 토큰이 있을 때만 실행
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserProfile,
    enabled: !!token, // 토큰이 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });

  // 로그인 함수
  const login = (newToken: string, newUserId: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId);
    setToken(newToken);
    setUserId(newUserId);
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
  };

  // 로그인 상태 확인
  const isLoggedIn = !!token && !!user;

  const value = {
    isLoggedIn,
    user: user || null,
    login,
    logout,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 인증 컨텍스트 사용을 위한 커스텀 훅
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }

  return context;
}
