import React from 'react';

interface CommentListProps {
  postId: number;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  return <div>댓글 목록 (postId: {postId})</div>;
};

export default CommentList;
