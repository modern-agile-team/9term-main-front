import { User } from '@/app/_types/user.types';
import { get, patch, del } from './axios-client';

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
