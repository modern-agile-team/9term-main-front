'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMyProfile } from '@/app/_services/auth-provider';
import { createComment } from '@/app/_apis/client';
import type { CreateCommentRequest } from '@/app/_types/comment.types';

interface CommentFormProps {
  postId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const params = useParams();
  const groupId = params.id as string;
  const queryClient = useQueryClient();

  // 현재 사용자 정보 가져오기
  const { data: currentUser, isLoading: isUserLoading } = useMyProfile();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  // 댓글 작성 mutation
  const createCommentMutation = useMutation({
    mutationFn: (commentData: CreateCommentRequest) =>
      createComment(groupId, postId, commentData),
    onSuccess: () => {
      // 댓글 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: ['comments', groupId, postId],
      });
      // 폼 초기화
      setFormData({ title: '', content: '' });
    },
    onError: (error) => {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    // id가 없으면 name을 사용 (임시 해결책)
    const authorId = currentUser.id
      ? currentUser.id.toString()
      : currentUser.name;

    if (!authorId) {
      alert('사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const commentData: CreateCommentRequest = {
      groupId,
      authorId: authorId,
      title: formData.title.trim(),
      content: formData.content.trim(),
    };

    createCommentMutation.mutate(commentData);
  };

  // 로딩 상태 처리
  if (isUserLoading) {
    return <div className="p-4 text-gray-500">로딩 중...</div>;
  }

  // 로그인하지 않은 경우
  if (!currentUser) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600 text-center">
          댓글을 작성하려면{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            로그인
          </a>
          해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">댓글 작성</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 제목 입력 */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="댓글 제목을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={createCommentMutation.isPending}
          />
        </div>

        {/* 내용 입력 */}
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
            rows={4}
            value={formData.content}
            onChange={handleInputChange}
            placeholder="댓글 내용을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            disabled={createCommentMutation.isPending}
          />
        </div>

        {/* 작성자 정보 */}
        <div className="text-sm text-gray-600">
          작성자: {currentUser.name} ({currentUser.username})
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              createCommentMutation.isPending ||
              !formData.title.trim() ||
              !formData.content.trim()
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {createCommentMutation.isPending ? '작성 중...' : '댓글 작성'}
          </button>
        </div>
      </form>

      {/* 에러 메시지 */}
      {createCommentMutation.isError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">
            댓글 작성에 실패했습니다. 다시 시도해주세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentForm;
