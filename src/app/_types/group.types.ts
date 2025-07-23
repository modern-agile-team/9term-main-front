export interface GetGroupsResponse {
  status: string;
  message: string;
  data: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    memberCount: string;
    groupImage: File | null;
  }[];
}
