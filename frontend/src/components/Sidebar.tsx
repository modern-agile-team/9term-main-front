import KeywordAnalysis from "./KeywordAnalysis";
import ActivityStats from "./ActivityStats";
import MemberInvite from "./MemberInvite";

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
