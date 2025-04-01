'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Group, Post } from '@/types/models/group.types'
import { groupService } from '@/services/group.service'
import Navbar from '@/components/layout/Navbar'

type GroupDetailClientProps = {
  params: { id: string }
}

export default function GroupDetailClient({ params }: GroupDetailClientProps) {
  const [group, setGroup] = useState<Group | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const groupId = parseInt(params.id)
        const [groupData, postsData] = await Promise.all([
          groupService.getGroupById(groupId),
          groupService.getGroupPosts(groupId),
        ])
        setGroup(groupData)
        setPosts(postsData)
      } catch (err) {
        console.error('동아리 정보를 불러오는데 실패했습니다:', err)
        setError(
          '동아리 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="ml-3">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              다시 시도
            </button>
          </div>
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
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-4 text-gray-500">아직 등록된 게시글이 없습니다.</p>
            <p className="text-sm text-gray-400 mt-2">
              첫 번째 게시글을 작성해보세요!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/groups/${params.id}/posts/${post.id}`}
                className="block"
              >
                <div className="h-full bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
