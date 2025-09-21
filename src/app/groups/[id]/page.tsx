'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import BoardHeader from '@/app/groups/components/BoardHeader';
import Sidebar from '@/app/groups/components/Sidebar';
import PostList from '@/app/groups/components/posts/PostList';
import Calendar from '@/app/groups/components/Calendar';
import ActivityStats from '@/app/groups/components/ActivityStats';
import Gallery from '@/app/groups/components/Gallery';
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
import {
  useMembership,
  useGroupMembers,
} from '@/app/_services/membership-provider';

const GroupPage = () => {
  const params = useParams();
  const router = useRouter();
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
  const { isMember } = useMembership(groupId);

  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery(groupsQueries.groupPosts(groupId));
  const { data: groupsData } = useQuery(groupsQueries.groups());
  const groupData = groupsData?.data?.find((group) => group.id === groupId);
  const { data: membersData, isError: membersError } = useGroupMembers(groupId);
  const currentMember = membersData?.find((member) => member.userId === me?.userId);

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
    if (!isMember) {
      alert('그룹 가입 멤버만 게시물을 작성할 수 있습니다.');
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
      case '갤러리':
        return <Gallery groupId={groupId} />;
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
    <div className="min-h-screen">
      {/* 그룹 헤더 섹션 */}
      <div className="relative h-80 mx-4 mt-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
        {/* 배경 이미지 (API 추가 예정) */}
        <div className="absolute "></div>
        
        {/* 그룹 정보 */}
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-6xl mx-auto w-full px-4 -mb-4">
            <div className="flex items-end space-x-6">
              {/* 그룹 이미지 */}
              <div className="w-24 h-24 rounded-2xl bg-white shadow-lg overflow-hidden">
                {groupData?.groupImageUrl ? (
                  <img 
                    src={groupData.groupImageUrl} 
                    alt={groupData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">이미지</span>
                  </div>
                )}
              </div>
              
              {/* 그룹 정보 */}
              <div className="text-white flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold">{groupData?.name || '그룹명'}</h1>
                  {isMember && currentMember?.role === 'MANAGER' && (
                    <button
                      className="text-white/80 hover:text-white transition-colors"
                      onClick={() => {
                        // 편집 모달 열기 로직 추가 예정
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="text-white/80 mb-5  ">{groupData?.description || '그룹 설명'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 z-20 ">
              <BoardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="mt-6 "></div>
            </div>
            <div>
              {renderContent()}
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Sidebar onCreatePost={handleCreateButtonClick} groupId={groupId} />
            </div>
          </div>
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
