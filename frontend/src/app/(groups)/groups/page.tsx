"use client";

import { useState, useEffect } from "react";
import { Group } from "@/types/models/group.types";
import { groupService } from "@/services/group.service";
import Navbar from "@/components/layout/Navbar";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await groupService.getGroups();
        setGroups(data);
      } catch (error) {
        console.error("동아리 목록을 불러오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">동아리 목록</h1>

        {isLoading ? (
          <div className="flex justify-center">
            <p>로딩 중...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">등록된 동아리가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
                <p className="text-gray-600 mb-4">{group.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    멤버 {group.memberCount}명
                  </span>
                  <a
                    href={`/groups/${group.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    자세히 보기 →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
