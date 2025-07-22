'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMyProfile } from '@/app/_services/auth-provider';
import { createComment } from '@/app/_apis/client';
import type {
  CreateCommentRequest,
  ApiErrorResponse,
} from '@/app/_types/comment.types';
import { AxiosError } from 'axios';
import { invalidateCommentRelatedQueries } from '@/app/_utils/query-utils';
import { handleGeneralError } from '@/app/_utils/error-utils';

interface CommentFormProps {
  postId: number;
  groupId: number;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, groupId }) => {
  const queryClient = useQueryClient();

  // 현재 사용자 정보 가져오기
  const { data: currentUser, isLoading: isUserLoading } = useMyProfile();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    content: '',
  });

  // 에러 상태 관리
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 폼 초기화 함수
  const resetForm = () => {
    setFormData({ content: '' });
    setErrorMessage('');
  };

  // 댓글 작성 mutation 설정
  const createCommentMutation = useMutation({
    mutationFn: (commentData: CreateCommentRequest) =>
      createComment(groupId, postId, commentData),
    onSuccess: () => {
      invalidateCommentRelatedQueries(queryClient, groupId, postId);
      resetForm();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error('댓글 작성 실패:', error);
      setErrorMessage(handleGeneralError(error));
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 입력할 때 에러 메시지 초기화
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      setErrorMessage('댓글 내용을 입력해주세요.');
      return;
    }

    // 실제 API 스펙에 맞는 요청 데이터
    const commentData: CreateCommentRequest = {
      content: formData.content.trim(),
    };

    createCommentMutation.mutate(commentData);
  };

  // groupId가 없으면 에러 처리
  if (!groupId) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">
          그룹 정보를 불러올 수 없습니다. 페이지를 새로고침해주세요.
        </p>
      </div>
    );
  }

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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 댓글 내용 입력 */}
        <div>
          <textarea
            id="content"
            name="content"
            rows={4}
            value={formData.content}
            onChange={handleInputChange}
            placeholder="댓글을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            disabled={createCommentMutation.isPending}
          />
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              createCommentMutation.isPending || !formData.content.trim()
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {createCommentMutation.isPending ? '작성 중...' : '댓글 작성'}
          </button>
        </div>
      </form>

      {/* 에러 메시지 */}
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default CommentForm;
