import { queryOptions } from '@tanstack/react-query';
import { getMyProfile } from '@/app/_apis/user-api';

export const profileQueries = {
  myProfile: () =>
    queryOptions({
      queryKey: ['myProfile'],
      queryFn: () => getMyProfile(),
    }),
};
