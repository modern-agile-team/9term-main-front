'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getPost, getComments } from '@/app/_apis/client';
import CommentList from '@/app/groups/components/comments/CommentList';
import CommentForm from '@/app/groups/components/comments/CommentForm';
import { QUERY_KEYS } from '@/app/_utils/query-utils';

export default function PostDetailPage() {
  const params = useParams();
  const { id: groupIdParam, postId: postIdParam } = params as {
    id: string;
    postId: string;
  };
  const groupId = parseInt(groupIdParam, 10);
  const postId = parseInt(postIdParam, 10);

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.post(groupId, postId),
    queryFn: () => getPost(groupId, postId),
    enabled: !!groupId && !!postId,
  });

  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: QUERY_KEYS.comments(groupId, postId),
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
      {post.imageUrl && (
        <div className="mb-2 text-sm text-gray-600">
          <span className="mr-2">📍</span>
          <img

            src={post.imageUrl}

            alt="게시물 이미지"
            className="w-full h-auto"
          />
        </div>
      )}

      <div className="flex items-center text-sm text-gray-500 gap-4 mt-4">
        <span>👍 좋아요 {post.likes}</span>
        <span>💬 댓글 {post.commentsCount}</span>
      </div>
      <hr className="my-6" />
      <CommentForm postId={postId} groupId={groupId} />
      {isCommentsLoading ? (
        <p>댓글을 불러오는 중...</p>
      ) : (
        <CommentList
          comments={comments || []}
          groupId={groupId}
          postId={postId}
        />
      )}
    </div>
  );
}
