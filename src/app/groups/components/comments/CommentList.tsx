'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getComments } from '@/app/_apis/client';
import { useParams } from 'next/navigation';

interface CommentListProps {
  postId: number;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const params = useParams();
  const { id: groupId } = params as { id: string };

  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['comments', groupId, postId],
    queryFn: () => getComments(groupId, String(postId)),
    enabled: !!groupId && !!postId,
  });

  if (isLoading) {
    return <div>댓글을 불러오는 중...</div>;
  }

  if (isError) {
    return <div>댓글을 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">댓글</h2>
      {comments && comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id} className="mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <img
                    src={comment.user.profileImageUrl || '/default-profile.png'}
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold">{comment.user.name}</p>
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>아직 댓글이 없습니다.</p>
      )}
    </div>
  );
};

export default CommentList;
