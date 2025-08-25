'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Comment } from '@/app/_types/comment.types';
import {
  deleteComment,
  updateComment,
  createComment,
  getComments,
} from '@/app/_apis/client';
import { invalidateCommentRelatedQueries } from '@/app/_utils/query-utils';
import { useMyProfile } from '@/app/_services/auth-provider';
import { handleGeneralError } from '@/app/_utils/error-utils';

interface CommentListProps {
  comments: Comment[];
  groupId: number;
  postId: number;
}

interface CommentItemProps {
  comment: Comment;
  groupId: number;
  postId: number;
  onDelete: (commentId: number) => void;
  onUpdate: (commentId: number, content: string) => void;
  onReply: (parentId: number, content: string) => void;
  currentUserId?: string;
  isDeleting: boolean;
  isUpdating: boolean;
  isReplying: boolean;
  isParent?: boolean; // 부모댓글인지 구분
}

const CommentItem = ({
  comment,
  groupId,
  postId,
  onDelete,
  onUpdate,
  onReply,
  currentUserId,
  isDeleting,
  isUpdating,
  isReplying,
  isParent = false,
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  // 대댓글 조회
  const { data: replies = [] } = useQuery({
    queryKey: ['replies', groupId, postId, comment.id],
    queryFn: () => getComments(groupId, postId, comment.id),
    enabled: isParent && showReplies, // 부모댓글이고 답글 보기가 활성화된 경우에만 조회
  });

  // 답글 개수 조회 (항상 조회해서 개수만 확인)
  const { data: repliesCount = 0 } = useQuery({
    queryKey: ['repliesCount', groupId, postId, comment.id],
    queryFn: () => getComments(groupId, postId, comment.id),
    enabled: isParent, // 부모댓글인 경우에만 조회
    select: (data) => data.length, // 개수만 선택
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleSave = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onUpdate(comment.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleReply = () => {
    setIsReplyFormOpen(true);
    setReplyContent('');
  };

  const handleReplySubmit = () => {
    const trimmedReplyContent = replyContent.trim();
    const hasReplyContent = trimmedReplyContent.length > 0;

    if (hasReplyContent) {
      onReply(comment.id, trimmedReplyContent);
      setIsReplyFormOpen(false);
      setReplyContent('');
    }
  };

  const handleReplyCancel = () => {
    setIsReplyFormOpen(false);
    setReplyContent('');
  };

  return (
    <li className="mb-2">
      <div className="rounded-md p-2 hover:bg-gray-50">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <p className="text-sm">
              <span className="font-semibold">{comment.user.name}</span>
              <span className="text-gray-500 ml-2">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </p>
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none"
                  rows={2}
                  disabled={isUpdating}
                  placeholder="댓글을 수정하세요"
                  aria-label="댓글 수정"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSave}
                    disabled={isUpdating || !editContent.trim()}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-800 mt-1">{comment.content}</p>
            )}
          </div>
          {!isEditing && (
            <div className="flex gap-1">
              {currentUserId && (
                <button
                  onClick={handleReply}
                  disabled={isDeleting || isUpdating || isReplying}
                  className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  답글
                </button>
              )}
              {currentUserId === comment.user.name && (
                <>
                  <button
                    onClick={handleEdit}
                    disabled={isDeleting || isUpdating || isReplying}
                    className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(comment.id)}
                    disabled={isDeleting || isUpdating || isReplying}
                    className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* 답글 보기 버튼 (부모댓글인 경우에만) */}
        {isParent && (
          <div className="mt-2">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showReplies ? '답글 숨기기' : `답글 ${repliesCount}개`}
            </button>
          </div>
        )}
      </div>

      {/* 답글 작성 폼 */}
      {isReplyFormOpen && (
        <div className="mt-3 pl-4 border-l-2 border-gray-200">
          <div className="bg-gray-50 p-3 rounded-md">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none"
              rows={2}
              placeholder={`@${comment.user.name}님에게 답글을 남겨보세요`}
              aria-label="답글 작성"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleReplySubmit}
                disabled={!replyContent.trim() || isReplying}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isReplying ? '작성 중...' : '답글 작성'}
              </button>
              <button
                onClick={handleReplyCancel}
                className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 대댓글 목록 */}
      {isParent && showReplies && replies.length > 0 && (
        <ul className="pl-8 mt-2 border-l-2 ml-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              groupId={groupId}
              postId={postId}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onReply={onReply}
              currentUserId={currentUserId}
              isDeleting={isDeleting}
              isUpdating={isUpdating}
              isReplying={isReplying}
              isParent={false} // 대댓글은 부모가 아님
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const CommentList = ({ comments, groupId, postId }: CommentListProps) => {
  const queryClient = useQueryClient();
  const { data: currentUser } = useMyProfile();
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null
  );
  const [updatingCommentId, setUpdatingCommentId] = useState<number | null>(
    null
  );
  const [replyingCommentId, setReplyingCommentId] = useState<number | null>(
    null
  );

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) =>
      deleteComment(groupId, postId, commentId),
    onSuccess: () => {
      invalidateCommentRelatedQueries(queryClient, groupId, postId);
      setDeletingCommentId(null);
    },
    onError: (error: unknown) => {
      console.error('댓글 삭제 실패:', error);
      alert(handleGeneralError(error));
      setDeletingCommentId(null);
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => updateComment(groupId, postId, commentId, { content }),
    onSuccess: () => {
      invalidateCommentRelatedQueries(queryClient, groupId, postId);
      setUpdatingCommentId(null);
    },
    onError: (error: unknown) => {
      console.error('댓글 수정 실패:', error);
      alert(handleGeneralError(error));
      setUpdatingCommentId(null);
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: ({
      parentId,
      content,
    }: {
      parentId: number;
      content: string;
    }) => createComment(groupId, postId, { content, parentId }),
    onSuccess: () => {
      // 모든 관련 쿼리 무효화
      invalidateCommentRelatedQueries(queryClient, groupId, postId);
      setReplyingCommentId(null);
    },
    onError: (error: unknown) => {
      console.error('답글 작성 실패:', error);
      alert(handleGeneralError(error));
      setReplyingCommentId(null);
    },
  });

  const handleDeleteComment = (commentId: number) => {
    if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      setDeletingCommentId(commentId);
      deleteCommentMutation.mutate(commentId);
    }
  };

  const handleUpdateComment = (commentId: number, content: string) => {
    setUpdatingCommentId(commentId);
    updateCommentMutation.mutate({ commentId, content });
  };

  const handleReplyComment = (parentId: number, content: string) => {
    setReplyingCommentId(parentId);
    createReplyMutation.mutate({ parentId, content });
  };

  if (comments.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        아직 댓글이 없습니다.
      </p>
    );
  }

  return (
    <div>
      <ul>
        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            groupId={groupId}
            postId={postId}
            onDelete={handleDeleteComment}
            onUpdate={handleUpdateComment}
            onReply={handleReplyComment}
            currentUserId={currentUser?.name}
            isDeleting={deletingCommentId === comment.id}
            isUpdating={updatingCommentId === comment.id}
            isReplying={replyingCommentId === comment.id}
            isParent={true} // 모든 댓글이 부모댓글
          />
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
