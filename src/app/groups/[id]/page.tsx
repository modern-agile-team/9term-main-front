'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
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

// 그룹 상세 페이지 컴포넌트
// - 게시글 목록, 게시글 생성/수정/삭제 모달 상태 관리
// - 각 모달의 열기/닫기, 게시글 CRUD 동작을 연결
const GroupPage = () => {
  const params = useParams();
  const groupId = String(params.id!);
  const [activeTab, setActiveTab] = useState('자유게시판');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  const [groupPosts, setGroupPosts] = useState<{ [groupId: string]: Post[] }>(
    {}
  );

  const posts = groupPosts[groupId] || [];

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

  const handleCreatePost = (title: string, content: string) => {
    if (!user) return;
    const newPost: Post = {
      id: Date.now(),
      title,
      content,
      author: { id: String(user.id), username: user.name || '익명' },
      createdAt: new Date().toISOString(),
      category: activeTab as any,
      tags: [],
      likes: 0,
      comments: 0,
      saved: false,
      isNotice: false,
    };
    setGroupPosts((prev) => ({
      ...prev,
      [groupId]: [newPost, ...(prev[groupId] || [])],
    }));
  };

  const handleEditPost = (id: number, title: string, content: string) => {
    setGroupPosts((prev) => ({
      ...prev,
      [groupId]: (prev[groupId] || []).map((post) =>
        post.id === id ? { ...post, title, content } : post
      ),
    }));
  };

  const handleDeletePost = (id: number) => {
    setGroupPosts((prev) => ({
      ...prev,
      [groupId]: (prev[groupId] || []).filter((post) => post.id !== id),
    }));
  };

  const handleCreateButtonClick = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해 주세요.');
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleSetNotice = (post: Post) => {
    setGroupPosts((prev) => ({
      ...prev,
      [groupId]: (prev[groupId] || []).map((p) =>
        p.id === post.id ? { ...p, isNotice: true } : p
      ),
    }));
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
            currentUserId={user?.id}
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
