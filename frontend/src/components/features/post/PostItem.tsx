import { Post } from '@/types/models/post.types'

interface PostItemProps {
  post: Post
}

export default function PostItem({ post }: PostItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* 작성자 정보 */}
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
          {post.author?.username.charAt(0) || '?'}
        </div>
        <div>
          <div className="font-medium">{post.author?.username || '사용자'}</div>
          <div className="text-sm text-gray-500">{post.createdAt}</div>
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
            <span className="mr-2">🕒</span> {post.time}
          </p>
        </div>
      )}

      {/* 태그 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {(post.tags || []).map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 좋아요, 댓글, 저장 */}
      <div className="flex items-center text-sm text-gray-500 pt-3 border-t">
        <button className="flex items-center mr-4">
          <span className="mr-1">👍</span> 좋아요 {post.likes || 0}
        </button>
        <button className="flex items-center mr-4">
          <span className="mr-1">💬</span> 댓글 {post.comments || 0}
        </button>
        <button className="flex items-center">
          <span className="mr-1">{post.saved ? '⭐' : '☆'}</span> 저장
        </button>
      </div>
    </div>
  )
}
