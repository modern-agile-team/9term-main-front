import { FailModal } from "@/app/_components/FailModal";

export default function DeletePostModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}) {
  return (
    <FailModal
      isOpen={isOpen}
      onClose={onClose}
      title="게시글 삭제"
      message="이 작업은 되돌릴 수 없습니다."
      buttonText="삭제하기"
      onButtonClick={onConfirm}
      retryButtonText="취소"
      onRetry={onClose}
    />
  );
}