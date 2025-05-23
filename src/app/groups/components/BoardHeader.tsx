interface BoardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BoardHeader({
  activeTab,
  setActiveTab,
}: BoardHeaderProps) {
  const tabs = ['공지', '자유게시판', '일정', '통계'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      {/* 게시글 필터 탭 */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
