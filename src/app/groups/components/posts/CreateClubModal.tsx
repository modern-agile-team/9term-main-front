import React, { useState } from 'react';
import { createGroup } from '@/app/_apis/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsQueries } from '@/app/groups/_queries';
import { createPortal } from 'react-dom';
import { CreategroupFormData } from '@/app/_types/creategroup.types';

const ClubCreateModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState<CreategroupFormData>({
    name: '',
    description: '',
    groupImage : null,
  });
  const queryClient = useQueryClient();

  const createGroupMutation = useMutation({
    mutationFn: (formData: CreategroupFormData) => {
      if (!formData.groupImage) {
        throw new Error('이미지를 선택해주세요.');
      }
      return createGroup(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: groupsQueries.groups().queryKey,
      }); // 동아리 목록 갱신
      alert('동아리가 성공적으로 생성되었습니다!');
      setFormData({ name: '', description: '', groupImage: null });
      onClose();
    },
    onError: (error: any) => {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          '동아리 생성에 실패했습니다.'
      );
    },
  });

  const [isDragOver, setIsDragOver] = useState(false);

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
    if (file && file.type === 'image/jpeg') {
      setFormData((prev) => ({
        ...prev,
        groupImage: file,
      }));
    } else {
      alert('JPG 파일만 업로드 가능합니다.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
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
    handleImageChange(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createGroupMutation.mutate({
      name: formData.name,
      description: formData.description,
      groupImage: formData.groupImage,
    });
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', groupImage: null });
    setIsDragOver(false);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">동아리 생성</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 폼 내용 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 동아리 이름 */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              동아리 이름 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="동아리 이름을 입력하세요"
            />
          </div>

          {/* 동아리 설명 */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              동아리 설명 *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="동아리에 대한 설명을 입력하세요"
            />
          </div>

          {/* 동아리 프로필 이미지 */}
          <div>
            <label
              htmlFor="clubProfile"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              동아리 프로필 이미지 *
            </label>

            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                {formData.groupImage ? (
                  <div className="mb-4">
                    <img
                      src={URL.createObjectURL(formData.groupImage)}
                      alt="미리보기"
                      className="mx-auto h-20 w-20 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <svg
                    className="mx-auto h-8 w-8 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className="flex flex-col items-center text-sm text-gray-600">
                  <label
                    htmlFor="clubProfile"
                    className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 font-medium text-blue-600 hover:text-blue-500 hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 mb-2"
                  >
                    <span>파일 선택</span>
                    <input
                      id="clubProfile"
                      name="clubProfile"
                      type="file"
                      accept="image/jpeg"
                      onChange={handleFileInputChange}
                      className="sr-only"
                      required
                    />
                  </label>
                  <p className="text-center">
                    또는 이곳에 파일을 드래그해서 업로드
                  </p>
                </div>
                <p className="text-xs text-gray-500">JPG 파일만 업로드 가능</p>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={
                createGroupMutation.isPending ||
                !formData.name ||
                !formData.description ||
                !formData.groupImage
              }
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createGroupMutation.isPending ? '생성 중...' : '동아리 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
    ,
    document.body
  );
};

export default ClubCreateModal;
