// Next.js 클라이언트 컴포넌트임을 명시
'use client';

// React의 useState 훅 import
import { useState } from 'react';

// 게시글 작성 모달에 필요한 props 타입 정의
interface PostCreateModalProps {
  onClose: () => void; // 모달을 닫는 함수
  onCreate: (title: string, content: string) => void; // 게시글 생성 함수
}

// 게시글 작성 모달 컴포넌트 정의
export default function PostCreateModal({
  onClose, // 모달 닫기 함수
  onCreate, // 게시글 생성 함수
}: PostCreateModalProps) {
  // 제목 입력값 상태
  const [title, setTitle] = useState('');
  // 내용 입력값 상태
  const [content, setContent] = useState('');
  // 작성 중(로딩) 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 제출 시 실행되는 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 기본 동작(새로고침) 방지
    setIsSubmitting(true); // 작성 중 상태로 변경
    onCreate(title, content); // 상위에서 전달받은 게시글 생성 함수 호출
    setIsSubmitting(false); // 작성 중 상태 해제
    onClose(); // 모달 닫기
  };

  // 모달 UI 렌더링
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      {/* 모달 배경 및 위치 설정 */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        {/* 모달 제목 */}
        <h1 className="text-2xl font-bold mb-6">게시글 작성</h1>
        {/* 게시글 작성 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 입력란 */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              제목
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)} // 입력값 변경 시 상태 업데이트
              placeholder="제목을 입력하세요"
            />
          </div>
          {/* 내용 입력란 */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              내용
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={8}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={content}
              onChange={(e) => setContent(e.target.value)} // 입력값 변경 시 상태 업데이트
              placeholder="내용을 입력하세요"
            />
          </div>
          {/* 버튼 영역 */}
          <div className="flex justify-end gap-2">
            {/* 취소 버튼: 모달 닫기 */}
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-md font-medium border border-gray-300"
            >
              취소
            </button>
            {/* 작성 버튼: 폼 제출 */}
            <button
              type="submit"
              disabled={isSubmitting} // 작성 중일 때 비활성화
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? '작성 중...' : '작성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
