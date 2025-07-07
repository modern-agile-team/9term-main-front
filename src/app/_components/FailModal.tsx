'use client';

import React from 'react';

// 실패 모달 컴포넌트의 Props 타입 정의
interface FailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
  retryButtonText?: string; // 재시도 버튼 텍스트
  onRetry?: () => void; // 재시도 버튼 클릭 시 실행할 함수
}

/**
 * 재사용 가능한 실패 모달 컴포넌트
 *
 * @param isOpen 모달 표시 여부
 * @param onClose 모달 닫기 함수
 * @param title 모달 제목
 * @param message 모달 내용 메시지
 * @param buttonText 버튼 텍스트 (기본값: "확인")
 * @param onButtonClick 버튼 클릭 시 실행할 함수 (기본값: onClose)
 * @param retryButtonText 재시도 버튼 텍스트 (기본값: "다시 시도")
 * @param onRetry 재시도 버튼 클릭 시 실행할 함수 (지정하지 않으면 재시도 버튼 표시 안함)
 */
export const FailModal: React.FC<FailModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = '확인',
  onButtonClick,
  retryButtonText = '다시 시도',
  onRetry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-xl transform transition-all">
        <div className="p-6">
          <div className="flex justify-center">
            <div className="rounded-full h-20 w-20 flex items-center justify-center mx-auto bg-red-100 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-12"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
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
          <div className="mt-6 flex flex-col sm:flex-row sm:space-x-2">
            <button
              type="button"
              onClick={onButtonClick || onClose}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mb-2 sm:mb-0 ${
                onRetry ? 'sm:w-1/2' : 'sm:w-full'
              }`}
            >
              {buttonText}
            </button>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="w-full sm:w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {retryButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailModal;
