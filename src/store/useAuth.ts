// src/store/useAuth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 인증 상태의 타입 정의
interface AuthState {
  token: string | null;
  userId: string | null;
  isLoggedIn: boolean;

  // 액션 함수들
  login: (data: { token: string; userId: string }) => void;
  logout: () => void;
}

// persist 미들웨어를 사용하여 상태를 로컬 스토리지에 저장
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      isLoggedIn: false,

      login: (data) =>
        set({
          token: data.token,
          userId: data.userId,
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          token: null,
          userId: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: "auth-storage", // 로컬 스토리지에 저장될 키 이름
    }
  )
);
