export default function MemberInvite() {
  return (
    <div>
      <h3 className="text-lg font-bold mb-3">
        <span className="mr-2">👋</span> 멤버 초대
      </h3>

      <p className="text-sm text-gray-600 mb-3">
        아래 링크를 공유하여 새 멤버를 초대하세요
      </p>

      <div className="flex items-center bg-gray-50 p-2 rounded-md mb-3">
        <span className="text-xs text-gray-500 truncate flex-1">
          https://modumoimapp.kr/invite/dev123
        </span>
        <button className="text-xs text-blue-600 ml-2">복사</button>
      </div>

      <button className="w-full py-2 bg-blue-600 text-white rounded-md text-sm">
        새 링크 생성
      </button>
    </div>
  )
}
