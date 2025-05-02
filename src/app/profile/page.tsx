"use client";

export default function ProfilePage() {
  // 임시 더미 데이터 사용
  const dummyUser = {
    name: "홍길동",
    email: "hong@example.com",
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">프로필</h1>
      <div>
        <p>이름: {dummyUser.name}</p>
        <p>이메일: {dummyUser.email}</p>
      </div>
    </div>
  );
}
