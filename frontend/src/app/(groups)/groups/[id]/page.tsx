'use client'

import { useState, useEffect } from 'react'
import { Group, Post } from '@/types/models/group.types'
import { groupService } from '@/services/group.service'
import Navbar from '@/components/layout/Navbar'

interface GroupDetailPageProps {
  params: {
    id: string
  }
}

export default function GroupDetailPage({ params }: GroupDetailPageProps) {
  const [group, setGroup] = useState<Group | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const groupId = parseInt(params.id)
        const groupData = await groupService.getGroupById(groupId)
        setGroup(groupData)

        const postsData = await groupService.getGroupPosts(groupId)
        setPosts(postsData)
      } catch (error) {
        console.error('동아리 정보를 불러오는데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroupDetails()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">동아리를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold mb-4">{group.name}</h1>
          <p className="text-gray-600 mb-6">{group.description}</p>

          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">멤버 {group.memberCount}명</span>
            <span>
              개설일: {new Date(group.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">게시글</h2>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">등록된 게시글이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    작성자: {post.author}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
