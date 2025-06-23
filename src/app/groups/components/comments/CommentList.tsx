'use client';

import React, { useMemo } from 'react';
import { Comment } from '@/app/_types/comment.types';

interface CommentListProps {
  comments: Comment[];
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

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  return (
    <li className="mb-2">
      <div className="rounded-md p-2 hover:bg-gray-50">
        <div className="flex-grow">
          <p className="text-sm">
            <span className="font-semibold">{comment.user.name}</span>
            <span className="text-gray-500 ml-2">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </p>
          <p className="text-gray-800 mt-1">{comment.content}</p>
        </div>
      </div>
      {comment.children && comment.children.length > 0 && (
        <ul className="pl-8 mt-2 border-l-2 ml-4">
          {comment.children.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </ul>
      )}
    </li>
  );
};

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
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
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
