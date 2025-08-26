import { GetGroupsResponse } from '@/app/_types/group.types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsQueries } from '../_queries';
import ClubEditModal from './posts/EditClubModal';
import { useState } from 'react';
import { updateMemberStatus, leaveGroup } from '@/app/_apis/client';
import { useMyProfile } from '@/app/_services/auth-provider';
import {
  useMembership,
  useGroupMembers,
} from '@/app/_services/membership-provider';
import { CiCircleCheck, CiCircleRemove } from 'react-icons/ci';
import { FaPencilAlt } from 'react-icons/fa';
import { QUERY_KEYS } from '@/app/_utils/query-utils';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  onCreatePost: () => void;
  groupId: number;
}

export default function Sidebar({ onCreatePost, groupId }: SidebarProps) {
  const [isEditClubModalOpen, setIsEditClubModalOpen] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const { data, isLoading, isError } = useQuery(groupsQueries.groups());
  const {
    data: members,
    isLoading: membersLoading,
    isError: membersError,
  } = useGroupMembers(Number(groupId));
  const { data: me } = useMyProfile();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isMember } = useMembership(groupId);
  const clubs: GetGroupsResponse['data'] = data?.data ?? [];
  const club = clubs.find((club) => club.id === Number(groupId));
  const currentMember = members?.find((member) => member.userId === me?.userId);
  const isManager = currentMember?.role === 'MANAGER';
  const updateStatusMutation = useMutation({
    mutationFn: ({
      userId,
      action,
    }: {
      userId: number;
      action: 'APPROVE' | 'REJECT';
    }) => updateMemberStatus(groupId, userId, action),
    onSuccess: (data, variables) => {
      alert(`멤버 상태 변경 성공: ${variables.action} ${variables.userId}`);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.groupMembers(groupId),
      });
    },

    onError: (error) => {
      alert('멤버 상태 변경에 실패했습니다.');
      console.error('Update member status error:', error);
    },
  });

  const leaveGroupMutation = useMutation({
    mutationFn: () => leaveGroup(groupId),
    onSuccess: () => {
      alert('동아리를 성공적으로 탈퇴했습니다.');
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.groupMembers(groupId),
      });
      router.push('/');
    },
    onError: (error) => {
      alert('동아리 탈퇴에 실패했습니다.');
      console.error('Leave group error:', error);
    },
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>그룹을 불러오지 못했습니다.</div>;

  const getMemberStatusEmoji = (joinedAt: string) => {
    const joinDate = new Date(joinedAt);
    const now = new Date();

    let months = (now.getFullYear() - joinDate.getFullYear()) * 12;
    months -= joinDate.getMonth();
    months += now.getMonth();

    if (now.getDate() < joinDate.getDate()) {
      months--;
    }
    if (months >= 12) return '🌴';
    if (months >= 6) return '🌳';
    if (months >= 3) return '🌻';
    if (months >= 1) return '🌿';
    return '🌱';
  };

  return (
    <div className="h-full bg-white p-6 flex flex-col">
      {/* 동아리 프로필 섹션 */}
      <div className="border-b pb-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <img
                src={club?.groupImageUrl || ''}
                alt="동아리 프로필"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{club?.name}</h2>
              <p className="text-gray-600 text-sm">
                회원 {club?.memberCount}명
              </p>
            </div>
          </div>

          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => {
              setIsEditClubModalOpen(true);
            }}
          >
            {isManager && (
              <FaPencilAlt className="w-4 h-4 hover:text-gray-500 transition" />
            )}
          </button>
        </div>

        <div className="space-y-3">
          <button
            className={`flex items-center justify-center w-full py-2 rounded-lg font-medium ${
              isMember
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            onClick={isMember ? onCreatePost : undefined}
            title={
              !isMember ? '그룹 가입 멤버만 게시물을 작성할 수 있습니다.' : ''
            }
          >
            <span className="mr-2">✏️</span> 새 게시글 작성하기
          </button>

          {/* 멤버 버튼 */}
          <button
            onClick={() => {
              setShowMembers(!showMembers);
            }}
            className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span className="text-lg mr-2">🪪</span>
              <span>멤버</span>
            </div>
            <span className="text-sm text-gray-500">
              {members?.filter((member) => member.status !== 'REJECTED')
                .length || 0}
              명
            </span>
          </button>
        </div>
      </div>

      {/* 멤버 목록 */}

      {showMembers && (
        <div className="flex-1 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">멤버 목록</h3>
          <div className="space-y-3">
            {membersLoading ? (
              <div className="text-sm text-gray-500">멤버 목록 로딩 중...</div>
            ) : membersError ? (
              <div className="text-sm text-red-500">
                멤버만 접근 가능합니다.
              </div>
            ) : (
              members
                ?.filter((member) => member.status !== 'REJECTED')
                .map((member) => {
                  return (
                    <div
                      key={member.userId}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {member.name}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {member.role === 'MANAGER'
                              ? '👑'
                              : member.status === 'PENDING'
                              ? '⏳ 대기중'
                              : getMemberStatusEmoji(member.joinedAt)}
                          </span>

                          {/* 매니저만 승인/거절 버튼 표시 */}
                          {isManager &&
                            member.status === 'PENDING' &&
                            member.role !== 'MANAGER' && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() =>
                                    updateStatusMutation.mutate({
                                      userId: member.userId,
                                      action: 'APPROVE',
                                    })
                                  }
                                  disabled={updateStatusMutation.isPending}
                                >
                                  <CiCircleCheck className="w-6 h-6 hover:text-green-500 transition" />
                                </button>
                                <button
                                  onClick={() =>
                                    updateStatusMutation.mutate({
                                      userId: member.userId,
                                      action: 'REJECT',
                                    })
                                  }
                                  disabled={updateStatusMutation.isPending}
                                >
                                  <CiCircleRemove className="w-6 h-6 hover:text-red-500 transition" />
                                </button>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* 동아리 탈퇴 버튼 */}
      <div className="mt-auto pt-6">
        <button
          className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            if (confirm('정말로 동아리를 탈퇴하시겠습니까?')) {
              leaveGroupMutation.mutate();
            }
          }}
          disabled={leaveGroupMutation.isPending}
        >
          {leaveGroupMutation.isPending ? '탈퇴 중...' : '동아리 탈퇴하기'}
        </button>
      </div>

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
