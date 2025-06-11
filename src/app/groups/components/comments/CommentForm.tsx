import React from 'react';

interface CommentFormProps {
  postId: number;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  return <div>댓글 작성 폼 (postId: {postId})</div>;
};

export default CommentForm;
