'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { groupsQueries } from '../_queries';
import { Post } from '@/app/_types/post.types';
import { GalleryProps, ImageModalProps, ImageData } from '@/app/_types/gallery.types';
import Image from 'next/image';
import { createPortal } from 'react-dom';

const ImageModal = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  postTitle, 
  postContent, 
  authorName, 
  createdAt 
}: ImageModalProps) => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // 스크롤 방지
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 이미지 영역 - 전체 화면 활용 */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="relative w-full h-full max-w-7xl max-h-full">
            <Image
              src={imageUrl}
              alt={postTitle}
              fill
              className="object-contain"
              priority
              sizes="100vw"
            />
          </div>
        </div>

        {/* 게시물 정보 - 하단에 고정 */}
        <div className="bg-black bg-opacity-75 text-white p-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-2">{postTitle}</h3>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium">{postContent}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium">{authorName}</span>
                <span className="text-sm text-gray-300 ml-2">
                  {new Date(createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default function Gallery({ groupId }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  const { data: posts = [], isLoading, isError } = useQuery(groupsQueries.groupPosts(groupId));

  const postsWithImages = posts.filter((post: Post) => post.postImageUrl);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">이미지를 불러오는 중...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">이미지를 불러오지 못했습니다.</div>
      </div>
    );
  }

  if (postsWithImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium">아직 업로드된 이미지가 없습니다</p>
        <p className="text-sm">게시물에 이미지를 업로드해보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 갤러리 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">갤러리</h2>
          <span className="text-sm text-gray-500">
            총 {postsWithImages.length}개의 이미지
          </span>
        </div>
      </div>

      {/* 이미지 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {postsWithImages.map((post: Post) => (
          <div
            key={post.id}
            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
            onClick={() => setSelectedImage({
              imageUrl: post.postImageUrl!,
              postTitle: post.title,
              postContent: post.content,
              authorName: post.user.name,
              createdAt: post.createdAt
            })}
          >
            <Image
              src={post.postImageUrl!}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            
            {/* 호버 오버레이 */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                <p className="text-xs font-medium">확대보기</p>
              </div>
            </div>

            {/* 게시물 제목 오버레이 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-white text-xs font-medium truncate">{post.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 이미지 모달 */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.imageUrl}
          postTitle={selectedImage.postTitle}
          postContent={selectedImage.postContent}
          authorName={selectedImage.authorName}
          createdAt={selectedImage.createdAt}
        />
      )}
    </div>
  );
}
