export default function Sidebar() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="space-y-6">
        {/* 동아리 프로필 */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl text-gray-400">
              모
            </div>
            <div>
              <h2 className="text-lg font-bold">모던애자일 9기</h2>
              <p className="text-sm text-gray-500">멤버 19명</p>
            </div>
          </div>

          {/* 내 활동 & 알림 버튼 */}
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center space-x-2 bg-gray-50 rounded-md p-3 hover:bg-gray-100">
              <span>📊</span>
              <span className="text-sm font-medium">내 활동</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-gray-50 rounded-md p-3 hover:bg-gray-100">
              <span>🔔</span>
              <span className="text-sm font-medium">알림</span>
            </button>
          </div>
        </div>

        {/* 최근 내 활동 */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            최근 내 활동
          </h3>
          <div className="space-y-2">
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-sm text-gray-600">게시글 작성</p>
              <p className="text-xs text-gray-400">2시간 전</p>
            </div>
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-sm text-gray-600">댓글 작성</p>
              <p className="text-xs text-gray-400">3시간 전</p>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200" />

        {/* 탈퇴 버튼 */}
        <button className="w-full py-2 text-red-600 text-sm font-medium hover:text-red-700">
          동아리 탈퇴하기
        </button>
      </div>
    </div>
  )
}
