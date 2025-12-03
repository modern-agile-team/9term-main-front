interface BoardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BoardHeader({
  activeTab,
  setActiveTab,
}: BoardHeaderProps) {
  const tabs = ['공지', '자유게시판', '갤러리', '일정' /*'통계'*/];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* 게시글 필터 탭 */}
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-4 text-sm font-medium transition-all duration-200 rounded-xl ${
              activeTab === tab
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
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
