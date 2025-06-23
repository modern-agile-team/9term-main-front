'use client';

import React, { useState } from 'react';
import type { Post } from '@/app/_types/post.types';
import CommentList from '@/app/groups/components/comments/CommentList';
import CommentForm from '@/app/groups/components/comments/CommentForm';
import PostSettingsModal from './PostSettingsModal';
import { useQuery } from '@tanstack/react-query';
import { getComments } from '@/app/_apis/client';

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ['comments', post.groupId, post.id],
    queryFn: () => getComments(String(post.groupId), String(post.id)),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto p-8">
        {/* 닫기/설정 버튼 */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="text-xl bg-transparent border-none cursor-pointer"
            aria-label="설정"
          >
            <span role="img" aria-label="설정">
              ⚙️
            </span>
          </button>
        </div>
        {/* 본문 */}
        <h2 className="text-2xl font-bold mb-2 break-words">{post.title}</h2>
        <div className="mb-4 text-gray-600 whitespace-pre-line break-words">
          {post.content}
        </div>
        <div className="mb-6 text-sm text-gray-400">
          작성자: {post.author?.username}
        </div>
        {/* 댓글 */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-2">댓글</h3>
          {isCommentsLoading ? (
            <p>댓글을 불러오는 중...</p>
          ) : (
            <CommentList comments={comments || []} />
          )}
          <CommentForm postId={post.id} />
        </div>
        {/* 설정 모달 */}
        {settingsOpen && (
          <PostSettingsModal
            post={post}
            onEdit={() => {}}
            onDelete={() => {}}
            onClose={() => setSettingsOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PostDetailModal;
