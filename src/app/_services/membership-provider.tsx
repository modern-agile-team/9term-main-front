'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth, useMyProfile } from './auth-provider';
import { groupsQueries } from '../groups/_queries';

export function useMembership(groupId: number) {
  const { isLoggedIn } = useAuth();
  const { data: me } = useMyProfile();
  const {
    data: members,
    isLoading,
    isError,
  } = useQuery(groupsQueries.groupMembers(groupId));

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
