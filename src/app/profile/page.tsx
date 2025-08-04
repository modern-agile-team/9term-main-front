'use client';
import { useMyProfile } from '@/app/_services/auth-provider';

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useMyProfile();

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !user) return <div>내 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20 px-2">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        {/* 아바타 */}
        <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center mb-4 shadow">
          <span className="text-3xl font-bold text-blue-600">
            {user.name?.charAt(0) || '?'}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">{user.name}</h1>
        <div className="w-full flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between text-gray-600 border-b pb-2">
            <span className="font-semibold">이름</span>
            <span>{user.name}</span>
          </div>
          <div className="flex items-center justify-between text-gray-600">
            <span className="font-semibold">아이디</span>
            <span>{user.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
