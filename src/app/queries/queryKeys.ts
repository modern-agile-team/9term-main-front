import { queryOptions } from '@tanstack/react-query';
import { getMyProfile } from '@/app/_apis/client';

export const profileQueries = {
  myProfile: () =>
    queryOptions({
      queryKey: ['myProfile'],
      queryFn: () => getMyProfile(),
    }),
};
export const groupQueries = {
  groupPosts: (groupId: string) => ['groupPosts', groupId] as const,
};
