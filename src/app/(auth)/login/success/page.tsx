'use client';

import { useEffect } from 'react';
import { useAuth } from '@/app/_services/auth-provider';

export default function LoginSuccessPage() {
  const { login } = useAuth();

  useEffect(() => {
    // URL Fragment에서 accessToken 추출
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.replace('#', '')).get('accessToken');
    
    if (token) {
      // 토큰을 localStorage에 저장
      login(token);
      
      // Fragment 제거하고 홈으로 리다이렉트
      window.location.replace('/home');
    } else {
      console.error('No accessToken found in URL fragment');
      // 토큰이 없으면 로그인 페이지로
      window.location.replace('/login');
    }
  }, [login]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}



