'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import SuccessModal from '@/app/_components/SuccessModal';
import FailModal from '@/app/_components/FailModal';
import apiClient from '@/app/_apis/client';

const registerUser = async (userData: {
  userName: string;
  name: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post('/auth/signup', userData, {
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
    throw new Error('회원가입 실패');
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userName: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      setIsSuccessModalOpen(true);
    },

    onError: (error: Error) => {
      setErrorMessage(error.message || '회원가입에 실패했습니다.');
      setIsFailModalOpen(true);
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

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      setIsFailModalOpen(true);
      return;
    }

    registerMutation.mutate({
      userName: formData.userName,
      name: formData.name,
      password: formData.password,
    });
  };

  const handleRetry = () => {
    setIsFailModalOpen(false);

    if (errorMessage === '비밀번호가 일치하지 않습니다.') {
      return;
    }

    registerMutation.mutate({
      userName: formData.userName,
      name: formData.name,
      password: formData.password,
    });
  };

  const goToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              로그인
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                아이디
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="아이디"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="name" className="sr-only">
                이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="이름"
                value={formData.name}
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호 확인"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {registerMutation.isPending ? '가입 중...' : '회원가입'}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="회원가입 완료!"
        message="회원가입이 성공적으로 완료되었습니다. 이제 로그인하여 서비스를 이용할 수 있습니다."
        buttonText="로그인하러 가기"
        onButtonClick={goToLogin}
      />

      <FailModal
        isOpen={isFailModalOpen}
        onClose={() => setIsFailModalOpen(false)}
        title="회원가입 실패"
        message={errorMessage}
        buttonText="확인"
        retryButtonText="다시 시도"
        onRetry={handleRetry}
      />
    </div>
  );
}
