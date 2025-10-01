import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { groupJoin } from '@/app/_apis/client';
import { AxiosError } from 'axios';
import { useInvalidateGroupRelatedQueries } from '@/app/_utils/query-utils';

interface JoinGroupBannerProps {
  groupId: number;
  groupName: string;
  onJoinSuccess: () => void;
}

export default function JoinGroupBanner({
  groupId,
  groupName,
  onJoinSuccess,
}: JoinGroupBannerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const queryClient = useQueryClient();
  const invalidateGroupQueries = useInvalidateGroupRelatedQueries();

  const joinMutation = useMutation({
    mutationFn: (groupId: number) => groupJoin(groupId),
    onSuccess: (response: { message: string }) => {
      invalidateGroupQueries(groupId);
      setIsSubmitting(false);
      setIsVisible(false);
      onJoinSuccess();
      if (response.message) {
        alert(response.message);
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setIsSubmitting(false);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    },
  });

  const handleJoin = () => {
    setIsSubmitting(true);
    joinMutation.mutate(groupId);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 transform transition-transform duration-300 ease-in-out">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📫</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {groupName} 동아리에 가입해보세요!
              </h3>
              <p className="text-sm text-gray-500">
                동아리 활동에 참여하고 멤버들과 소통해보세요.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsVisible(false)}
              className="px-3 py-2 text-gray-500 hover:text-gray-700"
            >
              나중에
            </button>
            <button
              onClick={handleJoin}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? '신청 중...' : '가입 신청'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
