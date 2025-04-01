import { Post } from '@/types/Post'

interface PostItemProps {
  post: Post
}

export default function PostItem({ post }: PostItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* 작성자 정보 */}
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
          {post.author.username.charAt(0) || '?'}
        </div>
        <div>
          <div className="font-medium">{post.author.username}</div>
          <div className="text-xs text-gray-500">{post.author.role}</div>
        </div>
      </div>

      {/* 게시글 제목 및 내용 */}
      <h3 className="text-lg font-bold mb-2">{post.title}</h3>
      <p className="text-gray-700 mb-3">{post.content}</p>

      {/* 장소 및 시간 정보 */}
      {post.location && (
        <div className="bg-gray-50 p-3 rounded-md mb-3">
          <p className="text-sm flex items-center mb-1">
            <span className="mr-2">📍</span> {post.location}
          </p>
          {post.time && (
            <p className="text-sm flex items-center">
              <span className="mr-2">🕒</span> {post.time}
            </p>
          )}
        </div>
      )}

      {/* 태그 */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 작성일 및 카테고리 */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
        <div className="flex items-center space-x-4">
          <button className="flex items-center">
            <span className="mr-1">👍</span> {post.likes}
          </button>
          <button className="flex items-center">
            <span className="mr-1">💬</span> {post.comments}
          </button>
          <button className="flex items-center">
            <span>{post.saved ? '⭐' : '☆'}</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <span>{post.createdAt}</span>
          <span className="px-2 py-1 bg-gray-100 rounded-full">
            {post.category}
          </span>
        </div>
      </div>
    </div>
  )
}
