import { queryOptions } from '@tanstack/react-query';
import { getGroupPosts, getGroups } from '../_apis/client';
import { QUERY_KEYS } from '@/app/_utils/query-utils';

export const groupsQueries = {
  all: ['groups'] as const,

  groups: () => {
    return queryOptions({
      queryKey: QUERY_KEYS.groups(),
      queryFn: () => getGroups(),
    });
  },
  groupPosts: (groupId: number) => {
    return queryOptions({
      queryKey: QUERY_KEYS.groupPosts(groupId),
      queryFn: () => getGroupPosts(groupId),
    });
  },
};
