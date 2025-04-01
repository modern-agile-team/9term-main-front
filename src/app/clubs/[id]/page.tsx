"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import BoardHeader from "@/components/features/posts/BoardHeader";
import PostList from "@/components/features/posts/PostList";
import Chart from "@/components/features/analytics/Chart";
import Calendar from "@/components/features/calendar/Calendar";
import type { Post } from "@/types/Post";

interface Club {
  id: string;
  name: string;
  description: string;
}

export default function ClubPage() {
  const params = useParams();
  const clubId = params.id as string;
  const [activeTab, setActiveTab] = useState("공지");
  const [club, setClub] = useState<Club | null>(null);
  const [posts] = useState<Post[]>([
    {
      id: 1,
      title: "3월 정기 모임 안내",
      content: "이번 달 정기 모임은 3월 15일 오후 7시입니다.",
      author: {
        id: 1,
        username: "운영진",
        role: "admin",
      },
      createdAt: "2024-03-01",
      updatedAt: "2024-03-01",
      category: "공지",
      location: "서울특별시 강남구 테헤란로 123",
      time: "2024-03-15 19:00",
      tags: ["정기모임", "오프라인"],
      likes: 5,
      comments: 2,
      saved: false,
    },
    {
      id: 2,
      title: "스터디 자료 공유",
      content: "React 스터디 자료 공유드립니다.",
      author: {
        id: 2,
        username: "김개발",
        role: "member",
      },
      createdAt: "2024-03-02",
      updatedAt: "2024-03-02",
      category: "자유",
      tags: ["스터디자료", "React"],
      likes: 3,
      comments: 1,
      saved: true,
    },
  ]);

  useEffect(() => {
    // 실제로는 API 호출을 통해 동아리 정보를 가져옵니다
    if (clubId === "1") {
      setClub({
        id: "1",
        name: "개발자 스터디",
        description: "함께 성장하는 개발자 모임",
      });
    }
  }, [clubId]);

  const renderContent = () => {
    switch (activeTab) {
      case "통계":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Chart />
          </div>
        );
      case "일정":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Calendar />
          </div>
        );
      default:
        return posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">게시글이 없습니다.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <PostList
              posts={posts.filter((post) =>
                activeTab === "공지"
                  ? post.category === "공지"
                  : post.category === "자유"
              )}
            />
          </div>
        );
    }
  };

  if (!club) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/4">
        <Sidebar />
      </div>
      <div className="lg:w-3/4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{club.name}</h1>
          <p className="text-gray-600 mt-2">{club.description}</p>
        </div>
        <BoardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderContent()}
      </div>
    </div>
  );
}
