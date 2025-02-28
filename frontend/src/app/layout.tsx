import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "Next.js 프로젝트 기본 설정",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children} {/* ✅ 클라이언트 컴포넌트를 여기서 불러오지 않음 */}
      </body>
    </html>
  );
}
