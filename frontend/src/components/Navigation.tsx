'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import NotificationList from './NotificationList'
import type { Notification } from '@/types/Notification'

export default function Navigation() {
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => pathname === path

  // 알림 목록 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 임시 알림 데이터
  const notifications: Notification[] = [
    {
      id: 1,
      title: '새 댓글이 달렸습니다',
      content: '회원님의 게시글에 새로운 댓글이 달렸습니다.',
      time: '10분 전',
      isRead: false,
    },
    {
      id: 2,
      title: '스터디 일정 변경',
      content: '다음 주 스터디 일정이 변경되었습니다. 확인해주세요.',
      time: '1시간 전',
      isRead: false,
    },
  ]

  const handleMarkAllAsRead = () => {
    console.info('모든 알림을 읽음 표시했습니다.')
    // TODO: 알림 상태 업데이트 로직 구현
  }

  const handleViewAllNotifications = () => {
    console.info('모든 알림 보기 페이지로 이동합니다.')
    // TODO: 알림 페이지 이동 로직 구현
  }

  return (
    <header className="bg-white shadow-sm">
      {/* 상단 로고 및 유틸리티 섹션 */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                모동구
              </Link>
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <span className="text-lg">🏠</span>
                <span>내 모임</span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative" ref={notificationRef}>
                <button
                  className="flex items-center text-gray-700 hover:text-blue-600"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <span className="text-lg">🔔</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                </button>

                {/* 알림 모달 */}
                {showNotifications && (
                  <NotificationList
                    notifications={notifications}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onViewAllNotifications={handleViewAllNotifications}
                  />
                )}
              </div>
              <Link
                href="/settings"
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <span className="text-lg">⚙️</span>
              </Link>
              <Link
                href="/auth/login"
                className="px-4 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 네비게이션 */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14">
          {/* 왼쪽 메뉴 */}
          <div className="flex space-x-8">
            <Link
              href="/"
              className={`inline-flex items-center px-1 border-b-2 font-medium ${
                isActive('/')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              홈
            </Link>
            <Link
              href="/posts"
              className={`inline-flex items-center px-1 border-b-2 font-medium ${
                isActive('/posts')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              게시글
            </Link>
            <Link
              href="/profile"
              className={`inline-flex items-center px-1 border-b-2 font-medium ${
                isActive('/profile')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              프로필
            </Link>
            <Link
              href="/settings"
              className={`inline-flex items-center px-1 border-b-2 font-medium ${
                isActive('/settings')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              설정
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
