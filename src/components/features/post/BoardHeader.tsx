interface BoardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BoardHeader({
  activeTab,
  setActiveTab,
}: BoardHeaderProps) {
  const tabs = ["공지", "자유게시판", "일정", "통계"];

  return (
    <div className="border-b mb-6">
      <div className="flex space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-4 px-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
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
