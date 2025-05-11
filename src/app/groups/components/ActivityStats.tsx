import Chart from '@/app/groups/components/Chart';

export default function ActivityStats() {
  return (
    <div>
      <h3 className="text-lg font-bold mb-3">
        <span className="mr-2">📊</span> 활동 통계
      </h3>

      <div className="h-80">
        <Chart />
      </div>
    </div>
  );
}
