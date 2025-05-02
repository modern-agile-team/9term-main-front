"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SuccessModal from "@/components/common/SuccesModal"; // 성공 모달 컴포넌트
import FailModal from "@/components/common/FailModal"; // 실패 모달 컴포넌트

// 회원가입 API 함수
const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await fetch("/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "회원가입 실패");
  }

  return response.json();
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // ===== 모달 관련 상태 관리 =====
  // 성공 모달 표시 여부를 관리하는 상태
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 실패 모달 표시 여부를 관리하는 상태
  const [showFailModal, setShowFailModal] = useState(false);

  // 실패 모달에 표시할 에러 메시지를 저장하는 상태
  // 이 상태가 동적으로 변경되면서 모달에 다양한 에러 메시지가 표시됨
  const [errorMessage, setErrorMessage] = useState("");

  // 입력 필드 변경 처리 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 회원가입 시도 함수
  // 실제 API 요청을 처리하고 성공/실패 결과를 반환
  const attemptRegister = async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      // 회원가입 API 연동
      const data = await registerUser(userData);
      console.info("회원가입 성공:", data);
      return { success: true };
    } catch (error) {
      console.error("회원가입 실패:", error);
      // 에러 객체에서 메시지 추출 또는 기본 메시지 사용
      const message =
        error instanceof Error
          ? error.message
          : "회원가입에 실패했습니다. 다시 시도해주세요.";

      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ===== 클라이언트 측 유효성 검사 =====
    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      // 비밀번호 불일치 시 에러 메시지 설정 및 실패 모달 표시
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      setShowFailModal(true);
      return;
    }

    // ===== API 호출 및 결과 처리 =====
    const result = await attemptRegister({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      // 회원가입 성공 시 성공 모달 표시
      setShowSuccessModal(true);
    } else {
      // 회원가입 실패 시 에러 메시지 설정 및 실패 모달 표시
      // result.message에는 API에서 반환된 실제 에러 메시지가 포함됨
      setErrorMessage(result.message || "회원가입에 실패했습니다.");
      setShowFailModal(true);
    }
  };

  // ===== 재시도 핸들러 =====
  // 실패 모달의 "다시 시도" 버튼 클릭 시 실행
  const handleRetry = async () => {
    // 모달 닫기
    setShowFailModal(false);

    // 비밀번호 불일치 에러인 경우 폼으로 돌아가기
    // 이 경우 사용자가 직접 폼을 수정해야 함
    if (errorMessage === "비밀번호가 일치하지 않습니다.") {
      return; // 모달만 닫고 폼으로 돌아감
    }

    // 약간의 딜레이 후 회원가입 재시도 (사용자 경험 향상)
    setTimeout(async () => {
      // 동일한 정보로 회원가입 재시도
      const result = await attemptRegister({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        // 재시도 성공 시 성공 모달 표시
        setShowSuccessModal(true);
      } else {
        // 재시도 실패 시 에러 메시지 업데이트 및 실패 모달 다시 표시
        setErrorMessage(result.message || "회원가입에 실패했습니다.");
        setShowFailModal(true);
      }
    }, 300);
  };

  // 로그인 페이지로 이동
  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
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
                사용자 이름
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="사용자 이름"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isLoading ? "가입 중..." : "회원가입"}
            </button>
          </div>
        </form>
      </div>

      {/* ===== 성공 모달 =====
          isOpen: 모달 표시 여부
          onClose: 모달 닫기 함수
          title, message: 모달 내용
          buttonText: 버튼 텍스트
          onButtonClick: 버튼 클릭 시 실행할 함수 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="회원가입 완료!"
        message="회원가입이 성공적으로 완료되었습니다. 이제 로그인하여 서비스를 이용할 수 있습니다."
        buttonText="로그인하러 가기"
        onButtonClick={goToLogin}
      />

      {/* ===== 실패 모달 =====
          isOpen: 모달 표시 여부 (showFailModal 상태로 제어)
          onClose: 모달 닫기 함수
          title: 모달 제목 (고정)
          message: 모달에 표시될 에러 메시지 (errorMessage 상태로 동적 변경)
          buttonText: 확인 버튼 텍스트
          retryButtonText: 재시도 버튼 텍스트
          onRetry: 재시도 버튼 클릭 시 실행할 함수 */}
      <FailModal
        isOpen={showFailModal}
        onClose={() => setShowFailModal(false)}
        title="회원가입 실패"
        message={errorMessage} /* 여기서 동적 에러 메시지가 모달에 전달됨 */
        buttonText="확인"
        retryButtonText="다시 시도"
        onRetry={handleRetry}
      />
    </div>
  );
}
