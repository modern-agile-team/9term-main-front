"use client";

import Chart from "@/components/features/analytics/Chart";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">대시보드</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <Chart />
      </div>
    </div>
  );
}
