'use client'

import { useState } from 'react'
import BoardHeader from '@/components/features/posts/BoardHeader'
import PostList from '@/components/features/posts/PostList'
import Sidebar from '@/components/layout/Sidebar'
import Chart from '@/components/features/analytics/Chart'
import Calendar from '@/components/features/calendar/Calendar'
import type { Post } from '@/types/Post'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('공지')
  const [posts] = useState<Post[]>([])

  const renderContent = () => {
    switch (activeTab) {
      case '통계':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Chart />
          </div>
        )
      case '일정':
        return <Calendar />
      default:
        return posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">게시글이 없습니다.</p>
          </div>
        ) : (
          <PostList posts={posts} />
        )
    }
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 왼쪽 컬럼 - 사이드바 영역 */}
        <div className="lg:w-1/4">
          <Sidebar />
        </div>

        {/* 오른쪽 컬럼 - 게시글 영역 */}
        <div className="lg:w-3/4">
          <BoardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderContent()}
        </div>
      </div>
    </>
  )
}
