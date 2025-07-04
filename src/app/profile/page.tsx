'use client';
import { useMyProfile } from '@/app/_services/auth-provider';

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useMyProfile();

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !user) return <div>내 정보를 불러올 수 없습니다.</div>;
  return (
    <div className="p-4 pt-16">
      <h1 className="text-2xl font-bold mb-4">프로필</h1>
      <div>
        <p>이름: {user.name}</p>
        <p>아이디: {user.username}</p>
      </div>
    </div>
  );
}
