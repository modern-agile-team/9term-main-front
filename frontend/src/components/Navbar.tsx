import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import NotificationList from "./NotificationList";
import { Notification } from "@/types/Notification";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 임시 알림 데이터
  const notifications: Notification[] = [
    {
      id: 1,
      title: "새 댓글이 달렸습니다",
      content: "회원님의 게시글에 새로운 댓글이 달렸습니다.",
      time: "10분 전",
      isRead: false,
    },
    {
      id: 2,
      title: "스터디 일정 변경",
      content: "다음 주 스터디 일정이 변경되었습니다. 확인해주세요.",
      time: "1시간 전",
      isRead: false,
    },
    {
      id: 3,
      title: "좋아요를 받았습니다",
      content: "회원님의 게시글이 좋아요를 받았습니다.",
      time: "3시간 전",
      isRead: true,
    },
  ];

  // 모든 알림을 읽음 표시
  const handleMarkAllAsRead = () => {
    console.log("모든 알림을 읽음 표시했습니다.");
    // 실제 구현에서는 여기서 알림 상태를 업데이트합니다.
  };

  // 모든 알림 보기
  const handleViewAllNotifications = () => {
    console.log("모든 알림 보기 페이지로 이동합니다.");
    // 실제 구현에서는 여기서 알림 페이지로 이동합니다.
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-600 mr-8">모동구</h1>
          <div className="hidden md:flex">
            <Link
              href="/"
              className="flex items-center text-gray-700 hover:text-blue-600 mr-6"
            >
              <span className="mr-1">🏠</span> 내 모임
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative" ref={notificationRef}>
            <button
              className="flex items-center text-gray-700 hover:text-blue-600"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="mr-1">🔔</span> 알림
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">
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
            <span className="mr-1">⚙️</span> 설정
          </Link>
        </div>
      </div>
    </nav>
  );
}
