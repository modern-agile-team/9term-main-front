import { Notification } from '@/app/_types/notification.types';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onViewAllNotifications: () => void;
}

export default function NotificationList({
  notifications,
  onMarkAllAsRead,
  onViewAllNotifications,
}: NotificationListProps) {
  return (
    <div className="bg-white">
      {/* 헤더 */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h3 className="font-medium text-gray-900">알림</h3>
        <button
          onClick={onMarkAllAsRead}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          모두 읽음
        </button>
      </div>

      {/* 알림 목록 */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            새로운 알림이 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                      !notification.isRead ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 푸터 */}
      <div className="p-3 border-t text-center bg-gray-50">
        <button
          onClick={onViewAllNotifications}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
        >
          모든 알림 보기
        </button>
      </div>
    </div>
  );
}
