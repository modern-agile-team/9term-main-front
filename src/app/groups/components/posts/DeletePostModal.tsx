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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      {/* 모달 배경 및 위치 설정 */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        {/* 모달 제목 */}
        <h2 className="text-xl font-bold mb-4">게시글 삭제</h2>
        {/* 안내 문구 */}
        <p className="mb-6">정말로 이 게시글을 삭제하시겠습니까?</p>
        {/* 버튼 영역 */}
        <div className="flex justify-end gap-2">
          {/* 취소 버튼: 모달 닫기 */}
          <button onClick={onClose} className="px-4 py-2 border rounded">
            취소
          </button>
          {/* 삭제 버튼: 삭제 확정 */}
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
