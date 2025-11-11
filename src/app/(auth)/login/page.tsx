'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/app/_services/auth-provider';
import SuccessModal from '@/app/_components/SuccessModal';
import FailModal from '@/app/_components/FailModal';
import { PATHS } from '@/app/(auth)/login/types/auth';
import { apiClient } from '@/app/_apis/client';
import GoogleOAuthButton from '@/app/_components/oauth/GoogleOAuthButton';
import KakaoOAuthButton from '@/app/_components/oauth/KakaoOAuthButton';

const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post('/auth/login', credentials, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (
      (error as any).response &&
      (error as any).response.data &&
      (error as any).response.data.message
    ) {
      throw new Error((error as any).response.data.message);
    }
    throw new Error('로그인 실패');
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (isLoggedIn) {
      router.push(PATHS.HOME);
    }
  }, [isLoggedIn, router]);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.data.accessToken);
      setShowSuccessModal(true);
    },
    onError: (error: unknown) => {
      const msg =
        (error as any)?.response?.data?.message ||
        '로그인에 실패했습니다. 다시 시도해주세요.';
      setErrorMessage(msg);
      setShowErrorModal(true);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loginMutation.mutate(formData);
  };

  const goToHome = () => {
    router.push(PATHS.HOME);
  };

  const handleRetry = () => {
    setShowErrorModal(false);
    loginMutation.mutate(formData);
  };

  // 로그인 상태 체크 중이거나 이미 로그인된 경우 로딩 표시
  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로그인된 사용자입니다. 홈으로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden border border-white/30" style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)' }}>
          <div className="grid lg:grid-cols-2">
            <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-20 h-20 border-4 border-purple-400 rounded-full"></div>
                <div className="absolute top-32 right-20 w-16 h-16 border-4 border-pink-400 rounded-lg rotate-45"></div>
                <div className="absolute bottom-20 left-1/4 w-24 h-24 border-4 border-orange-400 rounded-full"></div>
                <div className="absolute bottom-40 right-10 w-12 h-12 border-4 border-purple-400 rounded-lg"></div>
              </div>
              
              <div className="relative z-10">
                <div>
                 
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    모동구와 함께
                    <br />
                    <span className="text-purple-600">즐거운 하루</span> 되세요!
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    로그인하고 동아리 소식을 확인해보세요
                  </p>
                </div>

                <div className="mt-12">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-2">
                        <img
                          src="/main_img/모모.webp"
                          alt="모모"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-semibold text-center text-gray-700">모모</p>
                      <p className="text-xs text-center text-gray-500">친근함</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-2">
                        <img
                          src="/main_img/동동.webp"
                          alt="동동"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-semibold text-center text-gray-700">동동</p>
                      <p className="text-xs text-center text-gray-500">활발함</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-2">
                        <img
                          src="/main_img/구구.webp"
                          alt="구구"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-semibold text-center text-gray-700">구구</p>
                      <p className="text-xs text-center text-gray-500">창의성</p>
                    </div>
                  </div>
                  
                 
                </div>
              </div>
            </div>

            <div className="p-10 sm:p-14 flex flex-col justify-center">
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-4xl font-bold text-gray-900">
                    반가워요!
                  </h2>
                  <span className="text-4xl">👋</span>
                </div>
                <p className="text-lg text-gray-600">
                  간편하게 로그인하고 시작해보세요
                </p>
              </div>

              {false && (
                <>
                  <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
                    <div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="appearance-none block w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-200 text-base"
                        placeholder="아이디"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="appearance-none block w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-200 text-base"
                        placeholder="비밀번호"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loginMutation.isPending || isOAuthLoading}
                      className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base"
                    >
                      {loginMutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          로그인 중...
                        </span>
                      ) : (
                        '로그인'
                      )}
                    </button>
                  </form>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-gray-100" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-white text-sm font-medium text-gray-500">
                        또는
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-4 mb-10">
                <KakaoOAuthButton onLoading={setIsOAuthLoading} />
                <GoogleOAuthButton onLoading={setIsOAuthLoading} />
              </div>

              <div className="space-y-5">
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                      소셜로그인으로 자동 회원가입하세요!
                    
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="로그인 성공!"
        message="성공적으로 로그인되었습니다."
        buttonText="홈으로 이동"
        onButtonClick={goToHome}
      />

      <FailModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="로그인 실패"
        message={errorMessage}
        buttonText="확인"
        retryButtonText="다시 시도"
        onRetry={handleRetry}
      />
    </div>
  );
}
