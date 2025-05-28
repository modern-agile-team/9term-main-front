// 'use client';
// import { useParams } from 'next/navigation';
// import { mockPosts } from '@/app/groups/[id]/mocks/posts';

// export default function PostDetailPage() {
//   const params = useParams();
//   const { postId } = params as { postId: string };
//   const post = mockPosts.find((p) => p.id === Number(postId));

//   if (!post) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <p>존재하지 않는 게시글입니다.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
//       <div className="mb-2 text-gray-500 text-sm">
//         작성자: {post.author.username} | 작성일:{' '}
//         {new Date(post.createdAt).toLocaleString()}
//       </div>
//       <div className="mb-6 text-gray-700 whitespace-pre-line">
//         {post.content}
//       </div>
//       {post.location && (
//         <div className="mb-2 text-sm text-gray-600">
//           <span className="mr-2">📍</span>
//           {post.location}
//         </div>
//       )}
//       {post.time && (
//         <div className="mb-2 text-sm text-gray-600">
//           <span className="mr-2">🕒</span>
//           {post.time}
//         </div>
//       )}
//       <div className="flex flex-wrap gap-2 mb-3">
//         {(post.tags || []).map((tag) => (
//           <span
//             key={tag}
//             className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
//           >
//             {tag}
//           </span>
//         ))}
//       </div>
//       <div className="flex items-center text-sm text-gray-500 gap-4 mt-4">
//         <span>👍 좋아요 {post.likes}</span>
//         <span>💬 댓글 {post.comments}</span>
//         <span>{post.saved ? '⭐ 저장됨' : '☆ 저장 안 됨'}</span>
//       </div>
//     </div>
//   );
// }
