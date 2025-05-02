"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth-provider"; // Zustand 대신 새 Provider 사용
import SuccessModal from "@/components/common/SuccesModal";
import FailModal from "@/components/common/FailModal";

// JWT 로그인 API 함수
const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "로그인 실패");
  }

  return response.json();
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // 새 Provider에서 login 함수 가져오기

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 모달 상태
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // useMutation 사용하여 로그인 요청 관리
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // 로그인 성공 시 Context API의 login 함수 호출
      login(data.token, data.userId);
      setShowSuccessModal(true);
    },
    onError: (error) => {
      // 로그인 실패 시 에러 모달 표시
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "로그인에 실패했습니다. 다시 시도해주세요."
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

    // useMutation 실행
    loginMutation.mutate(formData);
  };

  // 로그인 성공 시 홈페이지로 이동
  const goToHome = () => {
    router.push("/");
  };

  // 로그인 재시도
  const handleRetry = async () => {
    setShowErrorModal(false);

    // 약간의 딜레이 후 로그인 재시도
    setTimeout(() => {
      loginMutation.mutate(formData);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            또는{" "}
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
              {loginMutation.isPending ? "로그인 중..." : "로그인"}
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
