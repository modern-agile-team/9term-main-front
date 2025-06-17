import React from 'react';
import type { Post } from '@/app/_types/post.types';

interface PostSettingsModalProps {
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const PostSettingsModal: React.FC<PostSettingsModalProps> = ({
  post: _post,
  onEdit,
  onDelete,
  onClose,
}) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>게시물 설정</h3>
        <button onClick={onEdit}>수정</button>
        <button onClick={onDelete}>삭제</button>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default PostSettingsModal;
