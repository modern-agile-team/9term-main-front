'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getPost, getComments } from '@/app/_apis/client';
import CommentList from '@/app/groups/components/comments/CommentList';
import CommentForm from '@/app/groups/components/comments/CommentForm';

export default function PostDetailPage() {
  const params = useParams();
  const { id: groupId, postId } = params as { id: string; postId: string };

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['post', groupId, postId],
    queryFn: () => getPost(groupId, postId),
    enabled: !!groupId && !!postId,
  });

  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ['comments', groupId, postId],
    queryFn: () => getComments(groupId, postId),
    enabled: !!groupId && !!postId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>게시글을 불러오지 못했거나 존재하지 않는 게시글입니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <div className="mb-2 text-gray-500 text-sm">
        작성자: {post.user.name} | 작성일:{' '}
        {new Date(post.createdAt).toLocaleString()}
      </div>
      <div className="mb-6 text-gray-700 whitespace-pre-line">
        {post.content}
      </div>
      {post.location && (
        <div className="mb-2 text-sm text-gray-600">
          <span className="mr-2">📍</span>
          {post.location}
        </div>
      )}
      {post.time && (
        <div className="mb-2 text-sm text-gray-600">
          <span className="mr-2">🕒</span>
          {post.time}
        </div>
      )}
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
      <div className="flex items-center text-sm text-gray-500 gap-4 mt-4">
        <span>👍 좋아요 {post.likes}</span>
        <span>💬 댓글 {post.comments}</span>
        <span>{post.saved ? '⭐ 저장됨' : '☆ 저장 안 됨'}</span>
      </div>
      <hr className="my-6" />
      <CommentForm postId={Number(postId)} />
      {isCommentsLoading ? (
        <p>댓글을 불러오는 중...</p>
      ) : (
        <CommentList comments={comments || []} />
      )}
    </div>
  );
}
