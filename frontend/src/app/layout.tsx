"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("@/mocks/msw")
        .then(() => console.log("[MSW] Mocking enabled."))
        .catch((err) => console.error("MSW 실행 실패:", err));
    }
  }, []);

  return (
    <html lang="ko">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
