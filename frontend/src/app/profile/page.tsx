"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/services/api";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  if (!user) return <p>로딩 중...</p>;

  return (
    <div>
      <h1>프로필</h1>
      <p>이름: {user.name}</p>
      <p>이메일: {user.email}</p>
    </div>
  );
}
