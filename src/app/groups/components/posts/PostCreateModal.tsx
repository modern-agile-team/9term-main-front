import React, { useState } from 'react';
import { createPost } from '@/app/_apis/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsQueries } from '@/app/groups/_queries';
import { createPortal } from 'react-dom';
import { PostCreateFormData } from '@/app/_types/post.types';

const PostCreateModal = ({
  isOpen,
  onClose,
  groupId,
}: {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
}) => {
  const [formData, setFormData] = useState<PostCreateFormData>({
    groupId: groupId,
    title: '',
    content: '',
    postImg: null,
  });
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: (formData: PostCreateFormData) => {
      return createPost(formData.groupId, {
        title: formData.title,
        content: formData.content,
        postImage: formData.postImg,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: groupsQueries.groupPosts(groupId).queryKey,
      });
      setFormData({ groupId, title: '', content: '', postImg: null });
      onClose();
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message);
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
        postImg: file,
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
    createPostMutation.mutate(formData);
    if (formData.postImg) {
      console.log('파일 상세정보:', {
        name: formData.postImg.name,
        size: formData.postImg.size,
        type: formData.postImg.type,
      });
    }
  };

  const handleClose = () => {
    setFormData({ groupId, title: '', content: '', postImg: null });
    setIsDragOver(false);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">게시물 생성</h2>
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
          {/* 게시물 제목 */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              게시물 제목 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="게시물 제목을 입력하세요"
            />
          </div>

          {/* 게시물 내용 */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              게시물 내용 *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="게시물 내용을 입력하세요"
            />
          </div>

          {/* 게시물 이미지 */}
          <div>
            <label
              htmlFor="clubProfile"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              게시물 이미지 (선택)
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
                {formData.postImg ? (
                  <div className="mb-4">
                    <img
                      src={URL.createObjectURL(formData.postImg)}
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
                    htmlFor="postImg"
                    className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 font-medium text-blue-600 hover:text-blue-500 hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 mb-2"
                  >
                    <span>파일 선택</span>
                    <input
                      id="postImg"
                      name="postImg"
                      type="file"
                      accept="image/jpeg"
                      onChange={handleFileInputChange}
                      className="sr-only"
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
                createPostMutation.isPending ||
                !formData.title ||
                !formData.content
              }
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createPostMutation.isPending ? '생성 중...' : '게시물 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default PostCreateModal;
