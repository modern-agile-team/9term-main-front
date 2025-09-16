'use client';
import { useMyProfile } from '@/app/_services/auth-provider';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteMyProfileImage, updateMyProfileImage, getUserGroups } from '../_apis/user-api';
import { QUERY_KEYS } from '../_utils/query-utils';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { IoTrashOutline, IoPersonOutline, IoImagesOutline, IoCheckmarkCircle, IoAlertCircleOutline, IoArrowForwardOutline, IoPeopleOutline } from 'react-icons/io5';
import { IMAGE_TYPES } from '../_types/image.types';
import type { ApiError } from '../_types/error.types';
import { MyGroup } from '../_types/mygroup.types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useMyProfile();
  const queryClient = useQueryClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 내 그룹 목록 가져오기
  const { data: myGroups, isLoading: groupsLoading, isError: groupsError } = useQuery({
    queryKey: ['my-groups'],
    queryFn: getUserGroups,
  });
  
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
    onError: (error: ApiError) => {
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
    onError: (error: ApiError) => {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          '프로필 이미지 수정에 실패했습니다.'
      );
    },
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }
  
  if (isError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoAlertCircleOutline className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-gray-600 font-medium">내 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen">
      <div className="pt-20 px-4 py-4">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* 프로필 정보 섹션 */}
             <div className="lg:col-span-1">
               <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 sticky top-20">
                <div className="text-center">
                  {/* 숨겨진 파일 입력 */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg, image/png, image/jpg, image/webp"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {/* 아바타 */}
                  <div className="relative inline-block mb-8">
                    <div
                        className={`w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center relative group cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl ${
                        isDragOver
                          ? 'ring-4 ring-gray-300 scale-110'
                          : 'hover:scale-105'
                      }`}
                      onClick={handleImageClick}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {/* 드래그 오버레이 */}
                      {isDragOver && (
                        <div className="absolute inset-0 bg-gray-200 bg-opacity-80 flex items-center justify-center rounded-full border-4 border-dashed border-gray-400">
                          <div className="text-gray-600 text-center">
                            <IoImagesOutline className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm font-semibold">드롭해서 업로드</p>
                          </div>
                        </div>
                      )}

                      {getImageSrc() ? (
                        <>
                          <img
                            src={getImageSrc()}
                            alt="profile"
                            className="w-full h-full object-cover rounded-full transition-all duration-300 group-hover:brightness-75"
                          />
                          {/* 호버 오버레이 */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-full">
                            <div className="text-white text-center">
                              <p className="text-sm font-medium">이미지 변경</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <IoPersonOutline className="w-14 h-14 mx-auto mb-2" />
                            <p className="text-xs font-medium">사진 추가</p>
                          </div>
                        </div>
                      )}
                    </div>


                    {/* 삭제 버튼 */}
                    {user.profileImageUrl && !previewImage && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('프로필 이미지를 삭제하시겠습니까?')) {
                            deleteProfileImageMutation.mutate();
                          }
                        }}
                        disabled={deleteProfileImageMutation.isPending}
                        className="absolute top-2 right-2 w-6 h-6 bg-gray-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:hover:scale-100 shadow-lg"
                        title="프로필 이미지 삭제"
                      >
                        {deleteProfileImageMutation.isPending ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <IoTrashOutline className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* 업로드 상태 표시 */}
                  {updateProfileImageMutation.isPending && (
                    <div className="mb-6">
                      <div className="inline-flex items-center px-6 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-sm font-semibold shadow-sm">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent mr-3"></div>
                        이미지 업로드 중...
                      </div>
                    </div>
                  )}

                  {/* 사용자 정보 */}
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-800">
                      {user.name}
                    </h2>
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium">
                      <span className="mr-1">@</span>
                      {user.username}
                    </div>
                  </div>
                </div>
              </div>
            </div>

             {/* 내 그룹 목록 섹션 */}
             <div className="lg:col-span-2">
               <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-800">
                    내 그룹
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm">
                    <IoCheckmarkCircle className="w-5 h-5 mr-2" />
                    <span>{myGroups?.data?.length || 0}개 그룹</span>
                  </div>
                </div>

                {groupsLoading ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">그룹 목록을 불러오는 중...</p>
                  </div>
                ) : groupsError ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IoAlertCircleOutline className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-gray-600 font-medium">그룹 목록을 불러오지 못했습니다.</p>
                  </div>
                 ) : myGroups?.data && myGroups.data.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {myGroups.data
                       .sort((a, b) => {
                         // PENDING 상태를 맨 뒤로 정렬
                         if (a.status === 'PENDING' && b.status !== 'PENDING') return 1;
                         if (a.status !== 'PENDING' && b.status === 'PENDING') return -1;
                         return 0;
                       })
                       .map((group: MyGroup, index: number) => (
                       <div
                         key={group.groupId}
                         className="group bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-200"
                         onClick={() => router.push(`/groups/${group.groupId}`)}
                         style={{ animationDelay: `${index * 100}ms` }}
                       >
                        <div className="flex items-start space-x-4">
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                            <Image
                              src={group.groupImgUrl}
                              alt={group.groupName}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-purple-600 transition-colors duration-200">
                              {group.groupName}
                            </h4>
                             <div className="flex flex-wrap gap-2 mb-3">
                               <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                 group.role === 'MANAGER' 
                                   ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' 
                                   : 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white'
                               }`}>
                                 {group.role === 'MANAGER' ? '👑 관리자' : '👤 멤버'}
                                 
                               </span>
                               {group.status === 'PENDING' && (
                                 <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-400 text-white shadow-sm">
                                   ⏳ 가입 대기중
                                 </span>
                               )}
                             </div>
                             {group.status !== 'PENDING' && (
                               <p className="text-sm text-gray-500 mb-2">
                                가입일: {new Date(group.joinedAt).toLocaleDateString('ko-KR')}~
                               </p>
                             )}
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <span className="text-sm text-purple-600 font-medium mr-2">그룹으로 이동</span>
                          <IoArrowForwardOutline className="w-5 h-5 text-purple-600 transform group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <IoPeopleOutline className="w-12 h-12 text-purple-400" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-3">아직 가입한 그룹이 없습니다</h4>
                    <p className="text-gray-500 text-lg">새로운 그룹에 가입해서 다양한 사람들과 소통해보세요!</p>
                    <button className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      그룹 찾아보기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}