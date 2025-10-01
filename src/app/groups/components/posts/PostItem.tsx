'use client';

import { Post } from '@/app/_types/post.types';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getComments } from '@/app/_apis/client';
import { likePost, unlikePost } from '@/app/_apis/post-api';
import CommentList from '@/app/groups/components/comments/CommentList';
import CommentForm from '@/app/groups/components/comments/CommentForm';
import { useMyProfile } from '@/app/_services/auth-provider';
import { useMembership } from '@/app/_services/membership-provider';
import { QUERY_KEYS, invalidatePostRelatedQueries } from '@/app/_utils/query-utils';

interface PostItemProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  onSetNotice?: (post: Post) => void;
}

export default function PostItem({
  post,
  onEdit,
  onDelete,
  onSetNotice,
}: PostItemProps) {
  const params = useParams();
  const groupId = parseInt(params.id as string, 10);
  const queryClient = useQueryClient();

  const [formattedDate, setFormattedDate] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: QUERY_KEYS.comments(groupId, post.id),
    queryFn: () => getComments(groupId, post.id),
    enabled: isCommentOpen && !!groupId,
  });

  const { data: me } = useMyProfile();
  const currentUserId = me?.name;
  const { isMember, isManager } = useMembership(groupId);
  const likeMutation = useMutation({
    mutationFn: () =>
      post.isLiked ? unlikePost(groupId, post.id) : likePost(groupId, post.id),
    onSuccess: () => {
      invalidatePostRelatedQueries(queryClient, groupId);
    },
  });
  const handleLikeClick = () => {
    likeMutation.mutate();
  };

  useEffect(() => {
    const date = new Date(post.createdAt);
    setFormattedDate(date.toLocaleString());
  }, [post.createdAt]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (_e: MouseEvent) => {
      setMenuOpen(false);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [menuOpen]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 relative">
      {/* 작성자 정보 */}
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
          <img
            src={post.user.profileImageUrl || ''}
            alt="profile"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div>
          <div className="font-m  edium">{post.user.name || '사용자'}</div>
          <div className="text-sm text-gray-500">{formattedDate}</div>
        </div>
      </div>

      {/* 게시글 제목 및 내용 */}
      <h3 className="text-lg font-bold mb-2">{post.title || '게시글 제목'}</h3>
      <p className="text-gray-700 mb-3">{post.content || '게시글 내용'}</p>

      {post.postImageUrl && (
        <div className="mb-3">
          <img
            src={post.postImageUrl}
            alt="게시물 이미지"
            className="w-full max-h-96 object-contain rounded-lg bg-white"
          />
        </div>
      )}

      {/* 좋아요, 댓글, 저장 */}
      <div className="flex items-center text-sm text-gray-500 pt-3 border-t gap-2">
        <button
          className={`flex items-center mr-4 transition-colors ${
            post.isLiked ? 'text-blue-500' : 'text-gray-500'
          } ${likeMutation.isPending ? 'opacity-50' : ''} ${
            !isMember ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={isMember ? handleLikeClick : undefined}
          disabled={likeMutation.isPending || !isMember}
          title={!isMember ? '그룹 가입 멤버만 좋아요를 할 수 있습니다.' : ''}
        >
          <span className="mr-1">{post.isLiked ? '❤️' : '🤍'}</span>
          좋아요 {post.likesCount || 0}
        </button>
        <button
          className={`flex items-center mr-4 ${
            !isMember ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={
            isMember ? () => setIsCommentOpen((prev) => !prev) : undefined
          }
          title={!isMember ? '그룹 가입 멤버만 댓글을 볼 수 있습니다.' : ''}
        >
          <span className="mr-1">💬</span> 댓글{' '}
          {comments ? comments.length : post.commentsCount || 0}
        </button>

        {currentUserId && (post.user.name === currentUserId || isManager) && (
          <div className="ml-auto relative">
            <button
              className="flex items-center px-2 py-1 text-gray-600 hover:text-gray-900"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((open) => !open);
              }}
            >
              <span role="img" aria-label="설정">
                ⚙️
              </span>
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 bottom-8 z-10 bg-white border rounded shadow-md min-w-[126px] text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {onEdit && (
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(post);
                    }}
                  >
                    ✏️ 수정
                  </button>
                )}
                {onDelete && (
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(post);
                    }}
                  >
                    🗑️ 삭제
                  </button>
                )}
                {onSetNotice && !post.isNotice && (
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600"
                    onClick={() => {
                      setMenuOpen(false);
                      onSetNotice(post);
                    }}
                  >
                    📢 공지로 등록
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {isCommentOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {isCommentsLoading ? (
            <p className="text-sm text-gray-500 text-center py-4">
              댓글을 불러오는 중...
            </p>
          ) : (
            <CommentList
              comments={comments || []}
              groupId={groupId}
              postId={post.id}
            />
          )}
          {isMember && <CommentForm postId={post.id} groupId={groupId} />}
        </div>
      )}
    </div>
  );
}
