'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import BoardHeader from '@/app/groups/components/BoardHeader';
import Sidebar from '@/app/groups/components/Sidebar';
import PostList from '@/app/groups/components/posts/PostList';
import Calendar from '@/app/groups/components/Calendar';
import ActivityStats from '@/app/groups/components/ActivityStats';
import PostCreateModal from '@/app/groups/components/posts/PostModal'; // 통합 모달
import DeletePostModal from '@/app/groups/components/posts/DeletePostModal';

import type { Post } from '@/app/_types/post.types';
import { useAuth, useMyProfile } from '@/app/_services/auth-provider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '@/app/_apis/client';
import { QUERY_KEYS } from '@/app/_utils/query-utils';
import { handleGeneralError } from '@/app/_utils/error-utils';
import JoinGroupBanner from '../components/JoinGroupBanner';

import { groupsQueries } from '../_queries';

const GroupPage = () => {
  const params = useParams();
  const groupId = parseInt(params.id as string, 10);
  const [activeTab, setActiveTab] = useState('자유게시판');
  const [showJoinBanner, setShowJoinBanner] = useState(false);

  // 통합 모달 상태 관리
  const [postModalState, setPostModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    postData: Post | null;
  }>({
    isOpen: false,
    mode: 'create',
    postData: null,
  });

  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const { data: me } = useMyProfile();
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery(groupsQueries.groupPosts(groupId));
  const { data: groupData } = useQuery(groupsQueries.group(groupId));
  const { data: membersData, isError: membersError } = useQuery(
    groupsQueries.groupMembers(groupId)
  );

  const deletePostMutation = useMutation({
    mutationFn: ({ groupId, postId }: { groupId: number; postId: number }) =>
      deletePost(groupId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.groupPosts(groupId),
      });
      setDeletePostId(null);
    },
    onError: (error: any) => {
      alert(handleGeneralError(error));
    },
  });

  const filteredPosts = posts.filter((post) =>
    activeTab === '공지' ? post.isNotice : !post.isNotice
  );
  const deletingPost = posts.find((p) => p.id === deletePostId);

  // 게시물 생성 모달 열기
  const handleCreateButtonClick = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해 주세요.');
      return;
    }
    setPostModalState({
      isOpen: true,
      mode: 'create',
      postData: null,
    });
  };

  // 게시물 수정 모달 열기
  const handleEditPost = (post: Post) => {
    setPostModalState({
      isOpen: true,
      mode: 'edit',
      postData: post,
    });
  };

  // 모달 닫기
  const handleClosePostModal = () => {
    setPostModalState({
      isOpen: false,
      mode: 'create',
      postData: null,
    });
  };
  // 멤버십 확인 로직
  React.useEffect(() => {
    if (!me) {
      setShowJoinBanner(false);
      return;
    }
    if (membersError) {
      setShowJoinBanner(true);
      return;
    }
    if (membersData) {
      const isMember = membersData.some(
        (member) => member.userId === me.userId
      );
      setShowJoinBanner(!isMember);
    } else {
      setShowJoinBanner(false);
    }
  }, [membersData, membersError, me]);
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
            onEdit={handleEditPost} // 수정된 핸들러
            onDelete={(post: Post) => setDeletePostId(post.id)}
            currentUserId={me?.name}
          />
        );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] relative mt-16">
      {/* 데스크톱 사이드바 */}
      <div className="hidden lg:block w-64 min-w-64">
        <Sidebar onCreatePost={handleCreateButtonClick} groupId={groupId} />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 w-full lg:w-auto">
        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          <BoardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderContent()}
        </div>
      </div>

      {/* 통합 게시물 모달 (생성/수정) */}
      <PostCreateModal
        isOpen={postModalState.isOpen}
        onClose={handleClosePostModal}
        groupId={groupId}
        mode={postModalState.mode}
        initialData={
          postModalState.postData
            ? {
                id: postModalState.postData.id,
                title: postModalState.postData.title,
                content: postModalState.postData.content,
                postImageUrl: postModalState.postData.postImageUrl || null,
              }
            : null
        }
      />

      {/* 삭제 모달 */}
      {deletePostId && deletingPost && (
        <DeletePostModal
          isOpen={!!deletePostId}
          onConfirm={() => {
            deletePostMutation.mutate({ groupId, postId: deletePostId });
          }}
          onClose={() => setDeletePostId(null)}
        />
      )}
      {/* 가입 배너 */}
      {showJoinBanner && groupData && (
        <JoinGroupBanner
          groupId={groupId}
          groupName={groupData.name}
          onJoinSuccess={() => {
            setShowJoinBanner(false);
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.groupMembers(groupId),
            });
          }}
        />
      )}
    </div>
  );
};

export default GroupPage;
