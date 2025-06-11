'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { mockGroups } from '@/app/groups/[id]/mocks/data';
import BoardHeader from '@/app/groups/components/BoardHeader';
import Sidebar from '@/app/groups/components/Sidebar';
import PostList from '@/app/groups/components/posts/PostList';
import Calendar from '@/app/groups/components/Calendar';
import ActivityStats from '@/app/groups/components/ActivityStats';
import PostCreateModal from '@/app/groups/components/posts/PostCreateModal';
import PostEditModal from '@/app/groups/components/posts/PostEditModal';
import DeletePostModal from '@/app/groups/components/posts/DeletePostModal';
import type { Post } from '@/app/_types/post.types';
import { useAuth } from '@/app/_services/auth-provider';
import { getGroupPosts } from '@/app/_apis/client';

// 그룹 상세 페이지 컴포넌트
// - 게시글 목록, 게시글 생성/수정/삭제 모달 상태 관리
// - 각 모달의 열기/닫기, 게시글 CRUD 동작을 연결
const GroupPage = () => {
  const params = useParams();
  const groupId = params.id as string;
  const [activeTab, setActiveTab] = useState('자유게시판');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  // React Query로 게시글 목록 조회
  const {
    data: posts = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['groupPosts', groupId],
    queryFn: () => getGroupPosts(groupId),
    enabled: !!groupId,
  });

  const group = mockGroups.find((g) => g.id === Number(groupId));

  const filteredPosts = posts.filter((post) =>
    activeTab === '공지' ? post.isNotice : !post.isNotice
  );
  const editingPost = posts.find((p) => p.id === editPostId);
  const deletingPost = posts.find((p) => p.id === deletePostId);

  const { user, isLoggedIn } = useAuth();

  if (!group) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>존재하지 않는 그룹입니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        게시글을 불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        게시글을 불러오지 못했습니다.
      </div>
    );
  }

  const handleCreatePost = (title: string, content: string) => {
    if (!user) return;
    const newPost: Post = {
      id: Date.now(),
      userId: Number(user.id),
      groupId: Number(groupId),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    // refetch로 최신화 (실제 API 연동 시에는 post 요청 후 refetch)
    refetch();
  };

  const handleEditPost = (id: number, title: string, content: string) => {
    // 실제 API 연동 시에는 patch/put 요청 후 refetch
    refetch();
  };

  const handleDeletePost = (id: number) => {
    // 실제 API 연동 시에는 delete 요청 후 refetch
    refetch();
  };

  const handleCreateButtonClick = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해 주세요.');
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleSetNotice = (post: Post) => {
    // 실제 API 연동 시에는 patch/put 요청 후 refetch
    refetch();
  };

  const renderContent = () => {
    switch (activeTab) {
      case '일정':
        return <Calendar />;
      case '통계':
        return <ActivityStats />;
      default:
        return (
          <PostList
            posts={filteredPosts}
            onEdit={(post: Post) => setEditPostId(post.id)}
            onDelete={(post: Post) => setDeletePostId(post.id)}
            onSetNotice={handleSetNotice}
            currentUserId={user?.id?.toString()}
          />
        );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] relative">
      {/* 데스크톱 사이드바 */}
      <div className="hidden lg:block w-64 min-w-64">
        <Sidebar onCreatePost={handleCreateButtonClick} />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 w-full lg:w-auto">
        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          <BoardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderContent()}
        </div>
      </div>

      {isCreateModalOpen && (
        <PostCreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreatePost}
        />
      )}
      {editPostId && editingPost && (
        <PostEditModal
          post={editingPost}
          onClose={() => setEditPostId(null)}
          onEdit={handleEditPost}
        />
      )}
      {deletePostId && deletingPost && (
        <DeletePostModal
          onConfirm={() => {
            handleDeletePost(deletePostId);
            setDeletePostId(null);
          }}
          onClose={() => setDeletePostId(null)}
        />
      )}
    </div>
  );
};

export default GroupPage;
