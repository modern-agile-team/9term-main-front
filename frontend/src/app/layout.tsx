"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Banner from "@/components/layout/Banner";
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // MSW 초기화 코드 개선
    async function enableMocking() {
      if (process.env.NODE_ENV === "development") {
        try {
          // 브라우저 환경에서만 실행
          if (typeof window !== "undefined") {
            await import("@/mocks/msw");
            console.log("[MSW] Mocking enabled.");
          }
        } catch (err) {
          console.error("[MSW] Failed to initialize:", err);
        }
      }
    }

    enableMocking();
  }, []);

  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50">
        <QueryClientProvider client={queryClient}>
          {/* 헤더 영역 */}
          <header>
            <Navigation />
            <Banner />
          </header>

          {/* 메인 콘텐츠 영역 */}
          <main className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </main>

          {/* 푸터 영역 (필요한 경우 추가) */}
          {/* <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <p className="text-center text-gray-500">© 2024 모동구. All rights reserved.</p>
            </div>
          </footer> */}
        </QueryClientProvider>
      </body>
    </html>
  );
}
