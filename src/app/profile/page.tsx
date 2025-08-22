'use client';
import { useMyProfile } from '@/app/_services/auth-provider';
import { useMutation } from '@tanstack/react-query';
import { deleteMyProfileImage, updateMyProfileImage } from '../_apis/user-api';
import { QUERY_KEYS } from '../_utils/query-utils';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import { IMAGE_TYPES } from '../_types/image.types';

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useMyProfile();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const deleteProfileImageMutation = useMutation({
    mutationFn: () => {
      return deleteMyProfileImage();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.myProfile(),
      });
      alert('프로필 이미지가 성공적으로 삭제되었습니다!');
    },
    onError: (error: any) => {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          '프로필 이미지 삭제에 실패했습니다.'
      );
    },
  });

  const updateProfileImageMutation = useMutation({
    mutationFn: (formData: FormData) => {
      return updateMyProfileImage(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.myProfile(),
      });
      alert('프로필 이미지가 성공적으로 수정되었습니다!');
      setPreviewImage(null);
    },
    onError: (error: any) => {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          '프로필 이미지 수정에 실패했습니다.'
      );
    },
  });
  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !user) return <div>내 정보를 불러올 수 없습니다.</div>;

  const handleImageChange = (file: File) => {
    if (file && IMAGE_TYPES.some((type) => type === file.type)) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      const formDataToSend = new FormData();
      formDataToSend.append('profileImage', file);
      updateProfileImageMutation.mutate(formDataToSend);
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

  const getImageSrc = () => {
    if (previewImage) return previewImage;
    return user.profileImageUrl || '';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20 px-2">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg, image/png, image/jpg, image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* 아바타 */}
        <div className="relative mb-4">
          <div
            className={`w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center shadow relative group cursor-pointer transition-all duration-200 ${
              isDragOver
                ? 'ring-4 ring-blue-300 ring-opacity-50'
                : 'hover:ring-4 hover:ring-blue-200 hover:ring-opacity-30'
            }`}
            onClick={handleImageClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* 드래그 오버레이 */}
            {isDragOver && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center rounded-full border-2 border-dashed border-blue-500">
                <div className="text-blue-700 text-center">
                  <svg
                    className="w-8 h-8 mx-auto mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-xs font-semibold">이미지 업로드</p>
                </div>
              </div>
            )}

            {getImageSrc() ? (
              <>
                <img
                  src={getImageSrc()}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full transition-opacity group-hover:opacity-75"
                />
                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded-full">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                    <svg
                      className="w-8 h-8 mx-auto mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-xs font-medium">
                      {updateProfileImageMutation.isPending
                        ? '업로드 중...'
                        : '이미지 변경'}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <p className="text-xs">프로필 사진</p>
                </div>
              </div>
            )}
          </div>

          {/* 삭제 버튼 - 이미지가 있을 때만 표시 */}
          {user.profileImageUrl && !previewImage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('프로필 이미지를 삭제하시겠습니까?')) {
                  deleteProfileImageMutation.mutate();
                }
              }}
              disabled={deleteProfileImageMutation.isPending}
              className="absolute top-4 right-2 w-5 h-5 bg-gray-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 disabled:hover:scale-100"
              title="프로필 이미지 삭제"
            >
              {deleteProfileImageMutation.isPending || (
                <IoTrashOutline className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* 업로드 상태 표시 */}
        {updateProfileImageMutation.isPending && (
          <div className="mb-4 text-blue-600 text-sm font-medium">
            이미지 업로드 중...
          </div>
        )}

        <h1 className="text-2xl font-bold mb-2 text-gray-800">{user.name}</h1>

        <div className="w-full flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between text-gray-600 border-b pb-2">
            <span className="font-semibold">이름</span>
            <span>{user.name}</span>
          </div>
          <div className="flex items-center justify-between text-gray-600">
            <span className="font-semibold">아이디</span>
            <span>{user.username}</span>
          </div>
        </div>

        {/* 도움말 */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>
            💡 <strong>팁:</strong> 프로필 이미지를 클릭하거나 드래그해서
            변경하세요
          </p>
        </div>
      </div>
    </div>
  );
}
