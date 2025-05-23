'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import NotificationList from '@/app/_components/NotificationList';
import { useAuth, useMyProfile } from '@/app/_services/auth-provider'; // 새 인증 Provider 사용
import type { Notification } from '@/app/_types/notification.types';

export default function TopNavigation() {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Auth Context에서 로그인 상태와 로그아웃 함수 가져오기
  const { isLoggedIn, logout } = useAuth();
  const { data: myProfile } = useMyProfile();

  // 알림 목록 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
  ];

  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  const handleViewAllNotifications = () => {
    // 모든 알림 페이지로 이동
    console.log('모든 알림 보기');
  };

  // 로그아웃 핸들러 추가
  const handleLogout = () => {
    logout();
    // 필요하다면 홈페이지로 리다이렉트하거나 다른 작업 수행
  };

  return (
    <div className="bg-white shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              모동구
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {/* 알림 버튼 - 로그인 시에만 표시 */}
            {isLoggedIn && (
              <div className="relative inline-block" ref={notificationRef}>
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
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200">
                    <NotificationList
                      notifications={notifications}
                      onMarkAllAsRead={handleMarkAllAsRead}
                      onViewAllNotifications={handleViewAllNotifications}
                    />
                  </div>
                )}
              </div>
            )}

            {/* 설정 버튼 - 로그인 시에만 표시 */}
            {isLoggedIn && (
              <Link
                href="/settings"
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <span className="text-lg">⚙️</span>
              </Link>
            )}

            {/* 로그인/프로필 버튼 */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {myProfile?.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <span>{myProfile?.name || '프로필'}</span>
                </Link>
                {/* 로그아웃 버튼 추가 */}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 text-sm"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-blue-600">
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
