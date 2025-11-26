import { User } from '@/app/_types/user.types';
import { get, patch, del } from './axios-client';
import { MyGroupsResponse } from '../_types/mygroup.types';

export const getMyProfile = async (): Promise<User> => {
  const response = await get<{
    status: string;
    message: string;
    data: User;
  }>('/users/me');

  return response.data;
};

export const updateMyProfileImage = async (
  formData: FormData
): Promise<User> => {
  const res = await patch<User>(`/users/me/image`, formData);
  return res;
};

export const deleteMyProfileImage = async (): Promise<User> => {
  const res = await del<User>(`/users/me/image`);
  return res;
};

export const getUserGroups = async (): Promise<MyGroupsResponse> => {
  const res = await get<MyGroupsResponse>(`/users/me/groups`);
  return res;
};
export const namechange = async (name: string): Promise<User> => {
  const res = await patch<User>(`/users/me/name`, { name });
  return res;
};