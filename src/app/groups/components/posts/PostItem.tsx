'use client';

import { Post } from '@/app/_types/post.types';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getComments } from '@/app/_apis/client';
import CommentList from '@/app/groups/components/comments/CommentList';
import CommentForm from '@/app/groups/components/comments/CommentForm';
import { useMyProfile } from '@/app/_services/auth-provider';

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
  const groupId = params.id as string;

  const [formattedDate, setFormattedDate] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ['comments', groupId, post.id],
    queryFn: () => getComments(groupId, String(post.id)),
    enabled: isCommentOpen && !!groupId,
  });

  const { data: me } = useMyProfile();
  const currentUserId = me?.name;

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
          {post.user.name.charAt(0) || '?'}
        </div>
        <div>
          <div className="font-medium">{post.user.name || '사용자'}</div>
          <div className="text-sm text-gray-500">{formattedDate}</div>
        </div>
      </div>

      {/* 게시글 제목 및 내용 */}
      <h3 className="text-lg font-bold mb-2">{post.title || '게시글 제목'}</h3>
      <p className="text-gray-700 mb-3">{post.content || '게시글 내용'}</p>

      {/* 장소 및 시간 정보 */}
      {post.location && (
        <div className="bg-gray-50 p-3 rounded-md mb-3">
          <p className="text-sm flex items-center mb-1">
            <span className="mr-2">📍</span> {post.location}
          </p>
          <p className="text-sm flex items-center">
            <span className="mr-2">🕒</span> {post.time?.slice(0, 5)}
          </p>
        </div>
      )}

      {/* 태그 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {(post.tags || []).map((tag: string) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 좋아요, 댓글, 저장 */}
      <div className="flex items-center text-sm text-gray-500 pt-3 border-t gap-2">
        <button className="flex items-center mr-4">
          <span className="mr-1">👍</span> 좋아요 {post.likes || 0}
        </button>
        <button
          className="flex items-center mr-4"
          onClick={() => setIsCommentOpen((prev) => !prev)}
        >
          <span className="mr-1">💬</span> 댓글{' '}
          {comments ? comments.length : post.comments || 0}
        </button>
        <button
          className="mr-4 text-sm flex items-center"
          onClick={() => console.log('save')}
        >
          <span className="mr-1">{post.saved ? '⭐' : '☆'}</span> 저장
        </button>

        {currentUserId && post.user.name === currentUserId && (
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
            <CommentList comments={comments || []} />
          )}
          <CommentForm postId={String(post.id)} groupId={groupId} />
        </div>
      )}
    </div>
  );
}
