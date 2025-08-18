import Link from 'next/link';
import { GetGroupsResponse } from '@/app/_types/group.types';
import { useQuery } from '@tanstack/react-query';
import { groupsQueries } from '../_queries';
import ClubEditModal from './posts/EditClubModal';
import { useState } from 'react';

interface SidebarProps {
  onCreatePost: () => void;
  groupId: number;
}

export default function Sidebar({ onCreatePost, groupId }: SidebarProps) {
  const [isEditClubModalOpen, setIsEditClubModalOpen] = useState(false);
  const { data, isLoading, isError } = useQuery(groupsQueries.groups());
  const clubs: GetGroupsResponse['data'] = data?.data ?? [];
  const club = clubs.find((club) => club.id === Number(groupId));

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>그룹을 불러오지 못했습니다.</div>;

  return (
    <div className="h-full bg-white p-6 flex flex-col">
      {/* 동아리 프로필 섹션 */}
      <div className="border-b pb-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <img
              src={club?.groupImageUrl || ''}
              alt="동아리 프로필"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => {
                setIsEditClubModalOpen(true);
              }}
            >
              <span>🔄</span>
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold">{club?.name}</h2>
            <p className="text-gray-600 text-sm">회원 {club?.memberCount}명</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            className="flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded-lg font-medium"
            onClick={onCreatePost}
          >
            <span className="mr-2">✏️</span> 새 게시글 작성하기
          </button>

          {/* 내 활동 및 알림 버튼 */}
          <Link
            href="/my-activities"
            className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span className="text-lg mr-2">📋</span>
              <span>내 활동</span>
            </div>
            <span className="text-sm text-gray-500">12개</span>
          </Link>

          <Link
            href="/my-notifications"
            className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span className="text-lg mr-2">🔔</span>
              <span>알림</span>
            </div>
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              3
            </span>
          </Link>
        </div>
      </div>

      {/* 최근 활동 목록 */}
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 mb-4">최근 활동</h3>
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              새 공지사항이 등록되었습니다.
            </p>
            <p className="text-xs text-gray-400 mt-1">1시간 전</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              회원님의 게시글에 새 댓글이 달렸습니다.
            </p>
            <p className="text-xs text-gray-400 mt-1">3시간 전</p>
          </div>
        </div>
      </div>

      {/* 동아리 탈퇴 버튼 */}
      <button
        className="mt-6 w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
        onClick={() => {
          if (confirm('정말로 동아리를 탈퇴하시겠습니까?')) {
            // 탈퇴 로직 구현
          }
        }}
      >
        동아리 탈퇴하기
      </button>

      {/* ClubEditModal 컴포넌트 렌더링 */}
      {isEditClubModalOpen && club && (
        <ClubEditModal
          clubData={club}
          isOpen={isEditClubModalOpen}
          onClose={() => setIsEditClubModalOpen(false)}
        />
      )}
    </div>
  );
}
