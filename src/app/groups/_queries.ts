import { queryOptions } from '@tanstack/react-query';
import { getGroupPosts, getGroups } from '../_apis/client';


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
