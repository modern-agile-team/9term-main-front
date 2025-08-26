'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth, useMyProfile } from './auth-provider';
import { getGroupMember } from '../_apis/client';
import { QUERY_KEYS } from '../_utils/query-utils';

export function useGroupMembers(groupId: number) {
  const { token } = useAuth();
  return useQuery({
    queryKey: QUERY_KEYS.groupMembers(groupId),
    queryFn: () => getGroupMember(groupId),
    enabled: !!token,
  });
}

export function useMembership(groupId: number) {
  const { isLoggedIn } = useAuth();
  const { data: me } = useMyProfile();
  const { data: members, isLoading, isError } = useGroupMembers(groupId);

  if (!isLoggedIn || !me || !members) {
    return {
      isMember: false,
      isManager: false,
      isLoading,
      isError,
    };
  }

  const currentMember = members.find((member) => member.userId === me.userId);
  const isMember = !!currentMember;
  const isManager =
    currentMember?.role === 'MANAGER' || currentMember?.role === 'ADMIN';

  return {
    isMember,
    isManager,
    isLoading,
    isError,
  };
}
