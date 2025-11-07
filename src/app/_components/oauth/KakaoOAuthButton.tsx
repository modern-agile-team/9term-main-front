'use client';

import { useState } from 'react';
import { initiateKakaoOAuth } from '@/app/_utils/auth-utils';

interface KakaoOAuthButtonProps {
  onLoading?: (loading: boolean) => void;
}

const KakaoOAuthButton = ({ onLoading }: KakaoOAuthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true);
      onLoading?.(true);
      
      // 카카오 OAuth 시작
      await initiateKakaoOAuth();
    } catch (error) {
      console.error('Kakao OAuth 로그인 실패:', error);
      setIsLoading(false);
      onLoading?.(false);
    }
  };

  return (
    <button
      onClick={handleKakaoLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center px-4 py-3 bg-[#FEE500] rounded-md text-black font-medium hover:bg-[#FDD835] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
          로그인 중...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.48 3 2 6.58 2 11c0 2.5 1.37 4.75 3.5 6.25-.2.75-.75 2.62-.85 3-.1.38.14.37.3.27.12-.08 1.95-1.35 2.8-1.95.75.15 1.55.23 2.38.23 5.52 0 10-3.58 10-8S17.52 3 12 3z"/>
          </svg>
          카카오 로그인
        </>
      )}
    </button>
  );
};

export default KakaoOAuthButton;
