'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/app/services/auth-provider'; // Zustand 대신 새 Provider 사용
import SuccessModal from '@/app/components/SuccessModal';
import FailModal from '@/app/components/FailModal';
import { PATHS } from '@/app/(auth)/login/types/auth';

// JWT 로그인 API 함수
const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '로그인 실패');
  }

  return response.json();
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // 새 Provider에서 login 함수 가져오기

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.token, data.userId);
      setShowSuccessModal(true);
    },
    onError: (error: Error) => {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '로그인에 실패했습니다. 다시 시도해주세요.'
      );
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

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            또는{' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              회원가입
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="이메일"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loginMutation.isPending ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
      </div>

      {/* 성공 모달 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="로그인 성공!"
        message="성공적으로 로그인되었습니다."
        buttonText="홈으로 이동"
        onButtonClick={goToHome}
      />

      {/* 실패 모달 */}
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
