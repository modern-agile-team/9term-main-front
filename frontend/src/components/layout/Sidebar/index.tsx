import KeywordAnalysis from "@/components/features/analytics/KeywordAnalysis";
import ActivityStats from "@/components/features/analytics/ActivityStats";
import MemberInvite from "@/components/features/members/MemberInvite";

export default function Sidebar() {
  return (
    <div className="space-y-4">
      <KeywordAnalysis />
      <ActivityStats />

      {/* 차트와 멤버 초대 사이 구분선 */}
      <div className="border-t border-gray-200 my-6"></div>

      <MemberInvite />
    </div>
  );
}
