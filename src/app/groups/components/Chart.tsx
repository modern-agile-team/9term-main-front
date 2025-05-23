'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// 월별 데이터
const monthlyData = [
  { name: '1월', 사용자: 400, 방문: 240 },
  { name: '2월', 사용자: 300, 방문: 140 },
  { name: '3월', 사용자: 600, 방문: 380 },
  { name: '4월', 사용자: 800, 방문: 500 },
  { name: '5월', 사용자: 500, 방문: 320 },
  { name: '6월', 사용자: 920, 방문: 580 },
];

export default function Chart() {
  const [isClient, setIsClient] = useState(false);
  const [activeChartType, setActiveChartType] = useState<'line' | 'bar'>('bar');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-64">
        차트 로딩 중...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 헤더 영역: 제목과 차트 타입 선택 버튼 */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">
          월별 사용자 통계{' '}
          {activeChartType === 'line' ? '(라인 차트)' : '(바 차트)'}
        </h2>
        <div className="flex space-x-1">
          <button
            className={`px-3 py-1 text-xs rounded-md ${
              activeChartType === 'line'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setActiveChartType('line')}
          >
            라인
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md ${
              activeChartType === 'bar'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setActiveChartType('bar')}
          >
            바
          </button>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeChartType === 'line' ? (
            <LineChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVisit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
              />
              <YAxis
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
                domain={[0, 1000]}
                ticks={[0, 250, 500, 750, 1000]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '4px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
              />
              <Line
                type="monotone"
                dataKey="사용자"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4, fill: '#8884d8' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="방문"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 4, fill: '#82ca9d' }}
              />
            </LineChart>
          ) : (
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
              />
              <YAxis
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
                domain={[0, 1000]}
                ticks={[0, 250, 500, 750, 1000]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '4px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="사용자"
                fill="#8884d8"
                barSize={24}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="방문"
                fill="#82ca9d"
                barSize={24}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
