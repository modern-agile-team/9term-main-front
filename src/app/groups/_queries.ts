import { queryOptions } from '@tanstack/react-query';
import {
  getGroupPosts,
  getGroups,
  getGroup,
  getGroupMember,
} from '../_apis/client';
import { QUERY_KEYS } from '../_utils/query-utils';

export const groupsQueries = {
  all: ['groups'] as const,

  groups: () => {
    return queryOptions({
      queryKey: QUERY_KEYS.groups(),
      queryFn: () => getGroups(),
    });
  },
  group: (groupId: number) => {
    return queryOptions({
      queryKey: QUERY_KEYS.group(groupId),
      queryFn: () => getGroup(groupId),
    });
  },
  groupPosts: (groupId: number) => {
    return queryOptions({
      queryKey: QUERY_KEYS.groupPosts(groupId),
      queryFn: () => getGroupPosts(groupId.toString()),
    });
  },
  groupMembers: (groupId: number) => {
    return queryOptions({
      queryKey: QUERY_KEYS.groupMembers(groupId),
      queryFn: () => getGroupMember(groupId),
    });
  },
};
