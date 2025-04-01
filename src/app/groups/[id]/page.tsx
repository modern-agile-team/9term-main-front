"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { mockGroups } from "@/mocks/data";
import { mockPosts } from "@/mocks/posts";
import BoardHeader from "@/components/features/post/BoardHeader";
import Sidebar from "@/components/layout/Sidebar";
import PostList from "@/components/features/post/PostList";
import Calendar from "@/components/features/calendar/Calendar";
import ActivityStats from "@/components/features/analytics/ActivityStats";
import { PenSquare } from "lucide-react";
import Link from "next/link";

const GroupPage = () => {
  const params = useParams();
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
    <div className="flex min-h-[calc(100vh-4rem)] relative">
      {/* 데스크톱 사이드바 */}
      <div className="hidden lg:block w-64 min-w-64">
        <Sidebar />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 w-full lg:w-auto">
        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          {/* 새 게시글 작성 버튼 */}
          <Link
            href="/posts/new"
            className="lg:hidden flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors mb-4"
          >
            <PenSquare size={20} />
            <span>새 게시글 작성하기</span>
          </Link>

          <BoardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
