'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment } from '@/app/_types/comment.types';
import { deleteComment, updateComment } from '@/app/_apis/client';
import {
  invalidateCommentRelatedQueries,
} from '@/app/_utils/query-utils';
import { useMyProfile } from '@/app/_services/auth-provider';
import { handleGeneralError } from '@/app/_utils/error-utils';

interface CommentListProps {
  comments: Comment[];
  groupId: number;
  postId: number;
}

const listToTree = (list: Comment[]): Comment[] => {
  const map: { [key: number]: number } = {};
  const roots: Comment[] = [];

  list.forEach((node, index) => {
    map[node.id] = index;
    node.children = [];
  });

  list.forEach((node) => {
    if (node.parentId !== null && list[map[node.parentId]]) {
      list[map[node.parentId]].children?.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

interface CommentItemProps {
  comment: Comment;
  groupId: number;
  postId: number;
  onDelete: (commentId: number) => void;
  onUpdate: (commentId: number, content: string) => void;
  currentUserId?: string;
  isDeleting: boolean;
  isUpdating: boolean;
}

const CommentItem = ({
  comment,
  groupId,
  postId,
  onDelete,
  onUpdate,
  currentUserId,
  isDeleting,
  isUpdating,
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

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
          {currentUserId === comment.user.name && !isEditing && (
            <div className="flex gap-1">
              <button
                onClick={handleEdit}
                disabled={isDeleting || isUpdating}
                className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                수정
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                disabled={isDeleting || isUpdating}
                className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          )}
        </div>
      </div>
      {comment.children && comment.children.length > 0 && (
        <ul className="pl-8 mt-2 border-l-2 ml-4">
          {comment.children.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              groupId={groupId}
              postId={postId}
              onDelete={onDelete}
              onUpdate={onUpdate}
              currentUserId={currentUserId}
              isDeleting={isDeleting}
              isUpdating={isUpdating}
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

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) =>
      deleteComment(groupId, postId, commentId),
    onSuccess: () => {
      invalidateCommentRelatedQueries(queryClient, groupId, postId);
      setDeletingCommentId(null);
    },
    onError: (error: any) => {
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
    onError: (error: any) => {
      console.error('댓글 수정 실패:', error);
      alert(handleGeneralError(error));
      setUpdatingCommentId(null);
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

  const commentTree = useMemo(() => listToTree(comments), [comments]);

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
        {commentTree.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            groupId={groupId}
            postId={postId}
            onDelete={handleDeleteComment}
            onUpdate={handleUpdateComment}
            currentUserId={currentUser?.name}
            isDeleting={deletingCommentId === comment.id}
            isUpdating={updatingCommentId === comment.id}
          />
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
