"use client";

import Sidebar from "@/components/layout/Sidebar";

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <aside className="w-80 border-r">
        <Sidebar />
      </aside>
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}
