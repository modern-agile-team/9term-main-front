"use client";

import React from "react";

// 성공 모달 컴포넌트의 Props 타입 정의
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

/**
 * 재사용 가능한 성공 모달 컴포넌트
 *
 * @param isOpen 모달 표시 여부
 * @param onClose 모달 닫기 함수
 * @param title 모달 제목
 * @param message 모달 내용 메시지
 * @param buttonText 버튼 텍스트 (기본값: "확인")
 * @param onButtonClick 버튼 클릭 시 실행할 함수 (기본값: onClose)
 */
export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "확인",
  onButtonClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-xl transform transition-all">
        <div className="p-6">
          <div className="flex justify-center">
            <div className="rounded-full h-20 w-20 flex items-center justify-center mx-auto bg-green-100 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h3 className="mt-4 text-center text-xl leading-6 font-bold text-gray-900">
            {title}
          </h3>
          <div className="mt-3">
            <p className="text-center text-gray-600">{message}</p>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={onButtonClick || onClose}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
