import { queryOptions } from "@tanstack/react-query";
import { getGroupPosts } from "../_apis/client";


export const groupsQueries = {
  all: ['groups'] as const, 

  // groups: () => {
  //   return queryOptions({
  //     queryKey: [...groupsQueries.all, 'list'] as const,
  //     queryFn: () => {},
  //   });
  // },
  groupPosts: (groupId: string) => {
    return queryOptions({
      queryKey: [...groupsQueries.all, 'groupPosts', groupId] as const,
      queryFn: () => getGroupPosts(groupId),
    });
  },  
}