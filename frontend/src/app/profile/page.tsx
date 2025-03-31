"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/api/client";

interface User {
  name: string;
  email: string;
  username?: string;
  bio?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        setUser(response.data);
      } catch (err) {
        setError('프로필을 불러오는데 실패했습니다.');
        console.error('Failed to fetch user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p>사용자 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-600">
            {user.name[0]}
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            {user.username && <p className="text-gray-500">@{user.username}</p>}
          </div>
        </div>

        {user.bio && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">소개</h2>
            <p className="text-gray-700">{user.bio}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            프로필 수정
          </button>
        </div>
      </div>
    </div>
  );
}
