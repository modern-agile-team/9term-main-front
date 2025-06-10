// Next.js 클라이언트 컴포넌트임을 명시
'use client';

// 게시글 삭제 확인 모달에 필요한 props 타입 정의
interface DeletePostModalProps {
  onConfirm: () => void; // 삭제 확정 시 실행되는 함수
  onClose: () => void; // 모달을 닫는 함수
}

// 게시글 삭제 확인 모달 컴포넌트 정의
export default function DeletePostModal({
  onConfirm, // 삭제 확정 콜백
  onClose, // 모달 닫기 콜백
}: DeletePostModalProps) {
  // 모달 UI 렌더링
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      {/* 모달 배경 및 위치 설정 */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
        {/* 아이콘과 제목 영역 */}
        <div className="text-center mb-6">
          {/* 경고 아이콘 */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          {/* 모달 제목 */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">게시글 삭제</h2>
          {/* 안내 문구 */}
          <p className="text-gray-600 leading-relaxed">
            이 작업은 되돌릴 수 없습니다.
            <br />
            정말로 이 게시글을 삭제하시겠습니까?
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          {/* 취소 버튼: 모달 닫기 */}
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            취소
          </button>
          {/* 삭제 버튼: 삭제 확정 */}
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
