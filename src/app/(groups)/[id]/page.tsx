"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { mockGroups } from "@/mocks/data";
import { Post } from "@/types/Post";

interface GroupDetailProps {
  params: {
    id: string;
  };
}

export default function GroupPage({ params }: GroupDetailProps) {
  const [activeTab, setActiveTab] = useState("공지");
  const group = mockGroups.find((g) => g.id === params.id);

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">그룹을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      {/* 왼쪽 사이드바 */}
      <div className="w-80 border-r bg-white p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
            📚
          </div>
          <div>
            <h1 className="text-xl font-bold">{group.name}</h1>
            <p className="text-gray-600">회원 {group.memberCount}명</p>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white rounded-lg py-2 mb-6 flex items-center justify-center gap-2">
          <span>✏️</span>
          <span>새 게시글 작성하기</span>
        </button>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span>📋</span>
              <span>내 활동</span>
            </div>
            <span className="text-gray-500 text-sm">12개</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span>🔔</span>
              <span>알림</span>
            </div>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              3
            </span>
          </div>
        </div>
      </div>

      {/* 오른쪽 컨텐츠 */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
        <p className="text-gray-600 mb-8">함께 성장하는 개발자 모임</p>

        {/* 탭 메뉴 */}
        <div className="border-b mb-6">
          <div className="flex space-x-6">
            {["공지", "자유게시판", "일정", "통계"].map((tab) => (
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

        {/* 게시글 목록 */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                윤
              </div>
              <div>
                <h3 className="font-bold">3월 정기 모임 안내</h3>
                <p className="text-sm text-gray-500">admin</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              이번 달 정기 모임은 3월 15일 오후 7시입니다.
            </p>
            <div className="text-sm text-gray-500">
              <p>📍 서울특별시 강남구 테헤란로 123</p>
              <p>🕐 2024-03-15 19:00</p>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                정기모임
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                오프라인
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
