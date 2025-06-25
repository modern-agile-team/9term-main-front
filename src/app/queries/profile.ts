import { queryOptions } from '@tanstack/react-query';
import { getMyProfile } from '@/app/_apis/client';

export const profileQueries = {
  myProfile: (token?: string | null) =>
    queryOptions({
      queryKey: ['myProfile', token],
      queryFn: () => getMyProfile(token),
    }),
};
