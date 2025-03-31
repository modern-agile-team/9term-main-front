import { Notification } from "@/types/Notification";

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
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 overflow-hidden">
      <div className="p-3 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-medium">알림</h3>
        <button className="text-xs text-blue-600" onClick={onMarkAllAsRead}>
          모두 읽음 표시
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <span className="text-xs text-gray-500">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p>새로운 알림이 없습니다</p>
          </div>
        )}
      </div>
      <div className="p-2 border-t border-gray-100 text-center">
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={onViewAllNotifications}
        >
          모든 알림 보기
        </button>
      </div>
    </div>
  );
}
