import { Notification } from '@/types/models/notification.types'

interface NotificationListProps {
  notifications: Notification[]
  onMarkAllAsRead: () => void
  onViewAllNotifications: () => void
}

export default function NotificationList({
  notifications,
  onMarkAllAsRead,
  onViewAllNotifications,
}: NotificationListProps) {
  return (
    <div className="absolute right-0 top-8 w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">알림</h3>
        <button
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          onClick={onMarkAllAsRead}
        >
          모두 읽음
        </button>
      </div>
      <div className="max-h-[480px] overflow-y-auto">
        {notifications.length > 0 ? (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-900">
                    {notification.type.charAt(0).toUpperCase() +
                      notification.type.slice(1)}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p className="text-sm">새로운 알림이 없습니다</p>
          </div>
        )}
      </div>
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <button
          className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
          onClick={onViewAllNotifications}
        >
          모든 알림 보기
        </button>
      </div>
    </div>
  )
}
