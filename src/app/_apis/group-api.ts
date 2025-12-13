import type {
  GetGroupsResponse,
  GroupMember,
  Group,
} from '@/app/_types/group.types';
import { get, post, patch, put, del } from './axios-client';

export const getGroups = async (): Promise<GetGroupsResponse> => {
  const res = await get<GetGroupsResponse>(`/groups`);
  return res;
};

export const getGroup = async (groupId: number): Promise<Group> => {
  const res = await get<Group>(`/groups/${groupId}`);
  return res;
};

export const createGroup = async (
  formData:
    | FormData
    | { name: string; description: string; groupImage: File | null }
): Promise<Group | undefined> => {
  const res = await post<Group>(`/groups`, formData);
  return res;
};

export const updateGroup = async (
  groupId: number,
  formData: { name: string; description: string }
): Promise<GetGroupsResponse | undefined> => {
  const res = await patch<GetGroupsResponse>(`/groups/${groupId}`, formData);
  return res;
};

export const updateGroupImage = async (
  groupId: number,
  formData: FormData
): Promise<GetGroupsResponse | undefined> => {
  const res = await put<GetGroupsResponse>(
    `/groups/${groupId}/image`,
    formData
  );
  return res;
};

export const getGroupMember = async (
  groupId: number
): Promise<GroupMember[]> => {
  const res = await get<{ data: GroupMember[] }>(`/groups/${groupId}/members`);
  return res.data;
};

export const groupJoin = async (
  groupId: number
): Promise<{ message: string; member: GroupMember }> => {
  const res = await post<{ message: string; member: GroupMember }>(
    `/groups/${groupId}/members`,
    {
      status: 'PENDING',
    }
  );
  return res;
};

export const updateMemberStatus = async (
  groupId: number,
  userId: number,
  action: 'APPROVE' | 'REJECT'
): Promise<void> => {
  await post<void>(`/groups/${groupId}/members/${userId}/status`, { action });
};
export const leaveGroup = async (groupId: number): Promise<void> => {
  await post<void>(`/groups/${groupId}/members/me/leave`);
};
 export const deleteGroup = async (groupId: number): Promise<void> => {
  await del<void>(`/groups/${groupId}`);
};

export const updateRecruitmentStatus = async (
  groupId: number,
  recruitStatus: 'ALWAYS_OPEN' | 'CLOSED' | 'OPEN'
): Promise<void> => {
  await patch<void>(`/groups/${groupId}/recruitment`, { recruitStatus });
};

export const updateGroupBannerImage = async (
  groupId: number,
  formData: FormData
): Promise<Group> => {
  const res = await put<Group>(`/groups/${groupId}/image/banner`, formData);
  return res;
};

export const updateManager = async (groupId: number,Id: number): Promise<void> => {
  await post<void>(`/groups/${groupId}/members/${Id}/role`, { role: 'MANAGER' });
};