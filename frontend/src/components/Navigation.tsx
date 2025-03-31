import React, { useState } from 'react'
import Link from 'next/link'
import NotificationList from '@/components/features/notification/NotificationList'
import { Notification } from '@/types/Notification'

// 임시 알림 데이터
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'post',
    message: '새로운 게시글이 등록되었습니다: "주말 등산 모임"',
    isRead: false,
    createdAt: new Date().toISOString(),
    link: '/posts/1',
  },
  {
    id: 2,
    type: 'comment',
    message: '회원님의 게시글에 새로운 댓글이 달렸습니다.',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    link: '/posts/1#comment-2',
  },
]

export default function Navigation() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications)

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    )
  }

  const handleViewAllNotifications = () => {
    // 모든 알림 페이지로 이동
    console.log('모든 알림 보기')
  }

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 왼쪽 영역: 로고 */}
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">9term</span>
            </Link>
          </div>

          {/* 오른쪽 영역: 알림, 프로필 */}
          <div className="flex items-center gap-4">
            {/* 알림 버튼 */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <span className="sr-only">알림</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
                {notifications.some((n) => !n.isRead) && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>

              {/* 알림 드롭다운 */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 z-10">
                  <NotificationList
                    notifications={notifications}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onViewAllNotifications={handleViewAllNotifications}
                  />
                </div>
              )}
            </div>

            {/* 프로필 버튼 */}
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                희
              </div>
              <span>희민</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
