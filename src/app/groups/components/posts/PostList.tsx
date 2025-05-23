import PostItem from '@/app/groups/components/posts/PostItem';
import { Post } from '@/app/_types/post.types';

// 게시글 목록을 렌더링하는 컴포넌트
// posts: 게시글 배열, onEdit/onDelete: 각 게시글 수정/삭제 콜백
interface PostListProps {
  posts: Post[];
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  onSetNotice?: (post: Post) => void;
  currentUserId?: string;
}

export default function PostList({
  posts,
  onEdit,
  onDelete,
  onSetNotice,
  currentUserId,
}: PostListProps) {
  if (posts.length === 0) {
    // 게시글이 없으면 아무것도 렌더링하지 않음
    return null;
    // 또는 안내문구를 원하면 아래처럼:
    // return <div className="text-center text-gray-400 py-8">게시글이 없습니다.</div>;
  }
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetNotice={onSetNotice}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
