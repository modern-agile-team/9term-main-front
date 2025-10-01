'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { IoIosClose } from "react-icons/io";
import {
  deleteGroup,
  updateGroup,
  updateGroupImage,
} from '@/app/_apis/group-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useInvalidateGroupRelatedQueries } from '@/app/_utils/query-utils';
import { createPortal } from 'react-dom';
import { GroupCreateFormData, Group } from '@/app/_types/group.types';
import { Card } from '@/app/_components/Card';
import { IMAGE_TYPES } from '@/app/_types/image.types';
import { SuccessModal } from '@/app/_components/SuccessModal';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ApiError } from '@/app/_types/error.types';

interface ClubEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubData: Group;
}
const ClubEditModal = ({ isOpen, onClose, clubData }: ClubEditModalProps) => {
  const [formData, setFormData] = useState<GroupCreateFormData>({
    name: '',
    description: '',
    groupImage: null,
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const invalidateGroupQueries = useInvalidateGroupRelatedQueries();
  const router = useRouter();

  // 초기 데이터 설정
  useEffect(() => {
    if (clubData) {
      setFormData({
        name: clubData.name,
        description: clubData.description,
        groupImage: null,
      });
    }
  }, [clubData]);

  // 이름 편집 모드 진입 시 포커스
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  // 설명 편집 모드 진입 시 포커스
  useEffect(() => {
    if (isEditingDescription && descriptionTextareaRef.current) {
      descriptionTextareaRef.current.focus();
    }
  }, [isEditingDescription]);

  if (!clubData) {
    return null;
  }

  // 텍스트 정보 수정 mutation
  const updateGroupInfoMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) => {
      return updateGroup(clubData.id, data);
    },
    onSuccess: () => {
      invalidateGroupQueries(clubData.id);
      alert('동아리 정보가 성공적으로 수정되었습니다!');
      setIsEditingName(false);
      setIsEditingDescription(false);
    },
    onError: (error: ApiError) => {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          '동아리 정보 수정에 실패했습니다.'
      );
    },
  });

  // 이미지 수정 mutation
  const updateGroupImageMutation = useMutation({
    mutationFn: (formData: FormData) => {
      return updateGroupImage(clubData.id, formData);
    },
    onSuccess: () => {
      invalidateGroupQueries(clubData.id);
      alert('동아리 이미지가 성공적으로 수정되었습니다!');
      setFormData((prev) => ({ ...prev, groupImage: null }));
    },
    onError: (error: ApiError) => {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          '동아리 이미지 수정에 실패했습니다.'
      );
    },
  });

  // 동아리 삭제 mutation
  const deleteGroupMutation = useMutation({
    mutationFn: (groupId: number) => {
      return deleteGroup(groupId);
    },
    onSuccess: () => {
      invalidateGroupQueries(clubData.id);
      // 삭제 성공 모달 표시
      setShowDeleteSuccessModal(true);
    },
    onError: (error: ApiError) => {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          '동아리 삭제에 실패했습니다.'
      );
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (file: File) => {
    if (file && IMAGE_TYPES.some((type) => type === file.type)) {
      setFormData((prev) => ({
        ...prev,
        groupImage: file,
      }));
      //setPreviewImage(URL.createObjectURL(file));

      // 자동으로 이미지 업로드
      const formDataToSend = new FormData();
      formDataToSend.append('groupImage', file);
      updateGroupImageMutation.mutate(formDataToSend);
    } else {
      alert('JPG, PNG, WEBP 파일만 업로드 가능합니다.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleNameSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setFormData((prev) => ({ ...prev, name: clubData.name }));
      setIsEditingName(false);
    }
  };

  const handleDescriptionSubmit = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      setFormData((prev) => ({ ...prev, description: clubData.description }));
      setIsEditingDescription(false);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('이름과 설명을 모두 입력해주세요.');
      return;
    }

    updateGroupInfoMutation.mutate({
      name: formData.name,
      description: formData.description,
    });
  };

  const handleClose = () => {
    setIsDragOver(false);
    setIsEditingName(false);
    setIsEditingDescription(false);
    setIsDeleteConfirmed(false);
    onClose();
  };

  const handleDelete = () => {
    deleteGroupMutation.mutate(clubData.id);
  };

  const handleDeleteSuccess = () => {
    setShowDeleteSuccessModal(false);
    onClose();
    router.push('/home');
  };

  if (!isOpen) return null;
  const getImagePreviewSrc = () => {
    if (formData.groupImage) {
      return URL.createObjectURL(formData.groupImage);
    }
    if (clubData?.groupImageUrl) {
      return clubData.groupImageUrl;
    }
    return null;
  };
  const imagePreviewSrc = getImagePreviewSrc();

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">동아리 수정/삭제</h2>
          
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
              <IoIosClose className="w-7 h-7" />
              
          </button>
        </div>

        {/* 편집 가능한 ClubCard */}
        <div className="p-6 overflow-y-auto flex-1">
          <Card className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden">
            {/* 드래그 오버레이 */}
            {isDragOver && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center z-10 border-2 border-dashed border-blue-500">
                <div className="text-blue-700 text-center">
                  
                  <p className="font-semibold">이미지 업로드</p>
                </div>
              </div>
            )}

            {/* 이미지 영역 */}
            <div
              className={`aspect-video w-full bg-gray-100 rounded-t-lg overflow-hidden relative group ${
                isDragOver ? 'border-2 border-dashed border-blue-500' : ''
              }`}
              onClick={handleImageClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imagePreviewSrc && imagePreviewSrc.trim() !== '' ? (
                <Image
                  src={imagePreviewSrc}
                  alt={clubData.name}
                  fill
                  className="object-cover transition-opacity group-hover:opacity-75"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                   
                    <p className="text-sm">이미지 클릭</p>
                  </div>
                </div>
              )}

              {/* 이미지 호버 오버레이 */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                  
                  <p className="text-xs font-medium">
                    {updateGroupImageMutation.isPending
                      ? '업로드 중...'
                      : '이미지 변경'}
                  </p>
                </div>
              </div>
            </div>

            {/* 숨겨진 파일 입력 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png, image/jpg, image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* 텍스트 영역 */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              {/* 제목 */}
              <div className="mb-2">
                {isEditingName ? (
                  <input
                    ref={nameInputRef}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onKeyDown={handleNameSubmit}
                    onBlur={() => {
                      if (formData.name.trim()) {
                        setIsEditingName(false);
                      }
                    }}
                    className="w-full text-blue-600 font-bold text-lg bg-blue-50 border-2 border-blue-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                    placeholder="동아리 이름을 입력하세요"
                  />
                ) : (
                  <h3
                    className="text-blue-600 font-bold text-lg truncate hover:bg-blue-50 rounded px-2 py-1 cursor-text transition-colors"
                    onClick={() => setIsEditingName(true)}
                  >
                    {formData.name}
                  </h3>
                )}
              </div>

              {/* 설명 */}
              <div className="mb-4">
                {isEditingDescription ? (
                  <textarea
                    ref={descriptionTextareaRef}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    onKeyDown={handleDescriptionSubmit}
                    onBlur={() => {
                      if (formData.description.trim()) {
                        setIsEditingDescription(false);
                      }
                    }}
                    rows={3}
                    className="w-full text-gray-600 text-sm bg-gray-50 border-2 border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-gray-500 resize-none"
                    placeholder="동아리 설명을 입력하세요 (Ctrl+Enter: 저장, Esc: 취소)"
                  />
                ) : (
                  <p
                    className="text-gray-600 text-sm line-clamp-3 hover:bg-gray-50 rounded px-2 py-1 cursor-text transition-colors min-h-[4rem]"
                    onClick={() => setIsEditingDescription(true)}
                  >
                    {formData.description}
                  </p>
                )}
              </div>

              {/* 멤버 수 (편집 불가) */}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>0명</span>
              </div>
            </div>
          </Card>

          {/* 저장 버튼 */}
          {(isEditingName ||
            isEditingDescription ||
            formData.name !== clubData.name ||
            formData.description !== clubData.description) && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSave}
                disabled={updateGroupInfoMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {updateGroupInfoMutation.isPending
                  ? '저장 중...'
                  : '변경사항 저장'}
              </button>
              <button
                onClick={() => {
                  setFormData({
                    name: clubData.name,
                    description: clubData.description,
                    groupImage: null,
                  });
                  setIsEditingName(false);
                  setIsEditingDescription(false);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                취소
              </button>
            </div>
          )}
          {/* 삭제 버튼 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <MdErrorOutline className="text-red-500 text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-800 mb-1">
                    위험한 작업
                  </h4>
                  <p className="text-sm text-red-700 mb-3">
                    동아리를 삭제하면 모든 게시글, 댓글, 멤버 정보가 영구적으로
                    삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                  </p>

                  {/* 확인 체크박스 */}
                  <div className="mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDeleteConfirmed}
                        onChange={(e) => setIsDeleteConfirmed(e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <span className="text-sm text-red-700 font-medium">
                        위 내용을 이해했으며, 동아리 삭제에 동의합니다
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handleDelete}
                    disabled={
                      !isDeleteConfirmed || deleteGroupMutation.isPending
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {deleteGroupMutation.isPending ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        삭제 중...
                      </>
                    ) : (
                      <>
                        <span>🗑️</span>
                        동아리 삭제
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

         
        </div>
      </div>

      {/* 삭제 성공 모달 */}
      <SuccessModal
        isOpen={showDeleteSuccessModal}
        onClose={handleDeleteSuccess}
        title="동아리 삭제 완료"
        message="동아리가 성공적으로 삭제되었습니다."
        buttonText="홈으로 이동"
        onButtonClick={handleDeleteSuccess}
      />
    </div>,
    document.body
  );
};

export default ClubEditModal;
