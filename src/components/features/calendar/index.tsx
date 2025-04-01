export default function Calendar() {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="grid grid-cols-7 gap-1">
        {/* 요일 헤더 */}
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div
            key={day}
            className="text-center py-2 text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}

        {/* 날짜 그리드 */}
        {Array.from({ length: 35 }, (_, i) => {
          const day = i + 1;
          const isToday = day === 15; // 예시로 15일을 오늘로 표시
          const hasEvent = day === 15; // 예시로 15일에 이벤트가 있다고 가정

          return (
            <div
              key={day}
              className={`
                aspect-square p-2 border rounded-lg
                ${isToday ? "bg-blue-50 border-blue-200" : "border-gray-100"}
                hover:border-blue-300 transition-colors
              `}
            >
              <div className="flex flex-col h-full">
                <span
                  className={`text-sm ${
                    isToday ? "text-blue-600 font-medium" : "text-gray-700"
                  }`}
                >
                  {day}
                </span>
                {hasEvent && (
                  <div className="mt-1 text-xs bg-blue-100 text-blue-700 rounded px-1 py-0.5">
                    정기 모임
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
