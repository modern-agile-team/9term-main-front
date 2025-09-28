'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRecruitmentStatus } from '@/app/_apis/group-api';
import { createPortal } from 'react-dom';
import { invalidateGroupRelatedQueries } from '@/app/_utils/query-utils';

interface RecruitmentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
  currentStatus: 'ALWAYS_OPEN' | 'CLOSED' | 'OPEN';
}

const statusOptions = [
  { value: 'ALWAYS_OPEN', label: '상시 모집', description: '언제든지 가입 가능' },
  { value: 'OPEN', label: '모집중', description: '현재 모집 중' },
  { value: 'CLOSED', label: '모집마감', description: '모집이 마감됨' },
];

export default function RecruitmentStatusModal({
  isOpen,
  onClose,
  groupId,
  currentStatus,
}: RecruitmentStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const queryClient = useQueryClient();

  // 모달이 열릴 때마다 현재 상태로 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(currentStatus);
    }
  }, [isOpen, currentStatus]);

  const updateStatusMutation = useMutation({
    mutationFn: (recruitStatus: 'ALWAYS_OPEN' | 'CLOSED' | 'OPEN') =>
      updateRecruitmentStatus(groupId, recruitStatus),
    onSuccess: () => {
      // 그룹 관련 모든 쿼리 무효화
      invalidateGroupRelatedQueries(queryClient, groupId);
      onClose();
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || '모집 상태 변경에 실패했습니다.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus !== currentStatus) {
      updateStatusMutation.mutate(selectedStatus);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            모집 상태 변경
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 폼 내용 */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedStatus === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="recruitStatus"
                  value={option.value}
                  checked={selectedStatus === option.value}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {option.value === 'ALWAYS_OPEN' && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        추천
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                </div>
              </label>
            ))}
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={updateStatusMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateStatusMutation.isPending ? '변경 중...' : '변경하기'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
