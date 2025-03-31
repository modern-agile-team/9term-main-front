'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCommunityPosts } from '@/services/communityApi'
import PostList from '@/components/features/posts/PostList'
import BoardHeader from '@/components/features/posts/BoardHeader'
import CreatePostButton from '@/components/features/posts/CreatePostButton'
import Sidebar from '@/components/layout/Sidebar'

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState('전체')
  const { data: posts = [] } = useQuery({
    queryKey: ['posts', activeTab],
    queryFn: () => getCommunityPosts(activeTab),
  })

  return (
    <>
      {/* 모바일과 태블릿 화면에서 보이는 게시글 작성 버튼 */}
      <div className="block lg:hidden mb-4">
        <CreatePostButton />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 왼쪽 컬럼 - 게시글 영역 */}
        <div className="md:w-2/3">
          <BoardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">게시글이 없습니다.</p>
            </div>
          ) : (
            <PostList posts={posts} />
          )}
        </div>

        {/* 오른쪽 컬럼 - 분석 및 정보 영역 */}
        <div className="md:w-1/3">
          {/* 데스크탑에서만 보이는 게시글 작성 버튼 */}
          <div className="hidden lg:block mb-4">
            <CreatePostButton />
          </div>

          <Sidebar />
        </div>
      </div>
    </>
  )
}
