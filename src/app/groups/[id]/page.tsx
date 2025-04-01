"use client";

import { useState } from "react";
import { mockGroups } from "@/mocks/data";
import { mockPosts } from "@/mocks/posts";
import BoardHeader from "@/components/features/post/BoardHeader";
import Sidebar from "@/components/layout/Sidebar";
import PostList from "@/components/features/post/PostList";
import Calendar from "@/components/features/calendar/Calendar";
import ActivityStats from "@/components/features/analytics/ActivityStats";

interface PageProps {
  params: {
    id: string;
  };
}

const GroupPage = ({ params }: PageProps) => {
  const [activeTab, setActiveTab] = useState("공지");
  const group = mockGroups.find((g) => g.id === Number(params.id));

  if (!group) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>존재하지 않는 그룹입니다.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "일정":
        return <Calendar />;
      case "통계":
        return <ActivityStats />;
      default:
        const filteredPosts = mockPosts.filter(
          (post) => post.category === activeTab
        );
        return <PostList posts={filteredPosts} />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* 왼쪽 사이드바 */}
      <Sidebar />

      {/* 오른쪽 컨텐츠 */}
      <div className="flex-1 p-6">
        <BoardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderContent()}
      </div>
    </div>
  );
};

export default GroupPage;
