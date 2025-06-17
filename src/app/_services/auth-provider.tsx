'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/app/_apis/client';
import { User } from '@/app/_types/user.types';

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
}

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 인증 Provider 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  // 로컬 스토리지에서 토큰 가져오기
  const [token, setToken] = useState<string | null>(null);
  const [_userId, setUserId] = useState<string | null>(null);

  // 초기 로드 시 로컬 스토리지에서 토큰 가져오기
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // 내 정보 쿼리
  const { data: user } = useMyProfile(token);

  // 로그인 함수
  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
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
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }

  return context;
}

export function useMyProfile(token?: string) {
  return useQuery<User>({
    queryKey: ['myProfile', token],
    queryFn: getMyProfile,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
}
