export interface GetGroupsResponse {
  status: string;
  message: string;
  data: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    memberCount: string;
    groupImage: string | null; // API 응답에서는 URL 문자열
  }[];
}
