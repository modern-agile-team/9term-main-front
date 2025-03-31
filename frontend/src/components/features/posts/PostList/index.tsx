import PostItem from '@/components/features/posts/PostItem'
import { Post } from '@/types/Post'

interface PostListProps {
  posts: Post[]
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  )
}
