'use client';

import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGroupBannerImage } from '@/app/_apis/group-api';
import { QUERY_KEYS } from '@/app/_utils/query-utils';
import SuccessModal from '@/app/_components/SuccessModal';
import FailModal from '@/app/_components/FailModal';
import { createPortal } from 'react-dom';

interface EditBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
  currentBannerUrl?: string | null;
}

export default function EditBannerModal({
  isOpen,
  onClose,
  groupId,
  currentBannerUrl,
}: EditBannerModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentBannerUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const updateBannerMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('groupBannerImage', file);
      return updateGroupBannerImage(groupId, formData);
    },
    onSuccess: () => {
      // 간단한 캐시 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groups() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.group(groupId) });
      setShowSuccessModal(true);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || '배너 이미지 변경에 실패했습니다.';
      setErrorMessage(msg);
      setShowErrorModal(true);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setErrorMessage('변경할 이미지를 선택해주세요.');
      setShowErrorModal(true);
      return;
    }

    updateBannerMutation.mutate(selectedFile);
  };

  const handleClose = () => {
    if (!updateBannerMutation.isPending) {
      setPreviewUrl(currentBannerUrl || null);
      setSelectedFile(null);
      onClose();
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    handleClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">배너 이미지 변경</h2>
            <button
              onClick={handleClose}
              disabled={updateBannerMutation.isPending}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 컨텐츠 */}
          <div className="p-6 space-y-6">
            {/* 미리보기 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                배너 이미지 미리보기
              </label>
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="배너 미리보기"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">배너 이미지가 없습니다</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 파일 선택 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                새 이미지 선택
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={updateBannerMutation.isPending}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>{selectedFile ? selectedFile.name : '이미지 파일 선택'}</span>
                </div>
              </button>
            </div>
          </div>

          {/* 푸터 */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
            <button
              onClick={handleClose}
              disabled={updateBannerMutation.isPending}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedFile || updateBannerMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {updateBannerMutation.isPending ? '변경 중...' : '변경하기'}
            </button>
          </div>
        </div>
      </div>

      {/* 성공 모달 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="배너 이미지 변경 완료"
        message="배너 이미지가 성공적으로 변경되었습니다."
        buttonText="확인"
        onButtonClick={handleSuccessClose}
      />

      {/* 실패 모달 */}
      <FailModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="배너 이미지 변경 실패"
        message={errorMessage}
        buttonText="확인"
      />
    </>,
    document.body
  );
}

