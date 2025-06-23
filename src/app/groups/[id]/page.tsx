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
import PostDetailModal from '@/app/groups/components/posts/PostDetailModal';
import type { Post } from '@/app/_types/post.types';
import { useAuth } from '@/app/_services/auth-provider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, getGroupPosts } from '@/app/_apis/client';

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
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const { user, isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  // 게시글 목록 패칭
  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery<Post[], Error>({
    queryKey: ['groupPosts', groupId],
    queryFn: () => getGroupPosts(groupId),
  });

  const createPostMutation = useMutation({
    mutationFn: ({
      groupId,
      title,
      content,
    }: {
      groupId: string;
      title: string;
      content: string;
    }) => createPost(groupId, { title, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupPosts', groupId] });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || '게시글 작성에 실패했습니다.');
    },
  });

  const filteredPosts = posts.filter((post) =>
    activeTab === '공지' ? post.isNotice : !post.isNotice
  );
  const editingPost = posts.find((p) => p.id === editPostId);
  const deletingPost = posts.find((p) => p.id === deletePostId);

  if (!mockGroups.find((g) => g.id === Number(groupId))) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>존재하지 않는 그룹입니다.</p>
      </div>
    );
  }

  const handleCreatePost = (title: string, content: string) => {
    createPostMutation.mutate({ groupId, title, content });
  };

  const handleCreateButtonClick = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해 주세요.');
      return;
    }
    setIsCreateModalOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case '일정':
        return <Calendar />;
      case '통계':
        return <ActivityStats />;
      default:
        if (isLoading) return <div>로딩 중...</div>;
        if (isError) return <div>게시글을 불러오지 못했습니다.</div>;
        return (
          <PostList
            posts={filteredPosts}
            onEdit={(post: Post) => setEditPostId(post.id)}
            onDelete={(post: Post) => setDeletePostId(post.id)}
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
          onEdit={() => {}}
        />
      )}
      {deletePostId && deletingPost && (
        <DeletePostModal
          onConfirm={() => {
            setDeletePostId(null);
          }}
          onClose={() => setDeletePostId(null)}
        />
      )}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default GroupPage;
