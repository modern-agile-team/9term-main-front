'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { profileQueries } from '@/app/queries/profile';

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
}

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 인증 Provider 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);

  // 초기 로드 시 로컬 스토리지에서 토큰 가져오기
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);


  // 로그인 함수
  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    queryClient.invalidateQueries(profileQueries.myProfile());
  };

  // 로그아웃 함수
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    queryClient.removeQueries({ queryKey: ['myProfile'] });
    window.location.href = '/login';
  };


  const value = {
    isLoggedIn: !!token,
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

export function useMyProfile() {
  const { token } = useAuth();
  return useQuery({
    ...profileQueries.myProfile(),
    enabled: !!token, // 토큰이 있을 때만 쿼리 실행
  });
}