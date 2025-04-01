interface BoardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BoardHeader({
  activeTab,
  setActiveTab,
}: BoardHeaderProps) {
  const tabs = ["전체", "스터디", "장소변경", "RESTful API", "강남역"];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">개발자 스터디 모임</h2>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          멤버 19명
        </span>
      </div>

      {/* 게시글 필터 탭 */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
