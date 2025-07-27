'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment } from '@/app/_types/comment.types';
import { deleteComment } from '@/app/_apis/client';
import { invalidateCommentDeleteQueries } from '@/app/_utils/query-utils';
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
  currentUserId?: string;
  isDeleting: boolean;
}

const CommentItem = ({
  comment,
  groupId,
  postId,
  onDelete,
  currentUserId,
  isDeleting,
}: CommentItemProps) => {
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
            <p className="text-gray-800 mt-1">{comment.content}</p>
          </div>
          {currentUserId === comment.user.name && (
            <button
              onClick={() => onDelete(comment.id)}
              disabled={isDeleting}
              className="ml-2 px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
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
              currentUserId={currentUserId}
              isDeleting={isDeleting}
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

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) =>
      deleteComment(groupId, postId, commentId),
    onSuccess: () => {
      invalidateCommentDeleteQueries(queryClient, groupId, postId);
      setDeletingCommentId(null);
    },
    onError: (error: any) => {
      console.error('댓글 삭제 실패:', error);
      alert(handleGeneralError(error));
      setDeletingCommentId(null);
    },
  });

  const handleDeleteComment = (commentId: number) => {
    if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      setDeletingCommentId(commentId);
      deleteCommentMutation.mutate(commentId);
    }
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
            currentUserId={currentUser?.name}
            isDeleting={deletingCommentId === comment.id}
          />
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
