export interface GroupCreateFormData {
  name: string;
  description: string;
  groupImage: File | null;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  groupImageUrl: string | null;
  groupBannerUrl: string | null;
  createdAt: string;
  memberCount: string;
  isRecruiting: boolean;
  recruitStatus: 'ALWAYS_OPEN' | 'CLOSED' | 'OPEN';
}

export interface GetGroupsResponse {
  status: string;
  message: string;
  data: Group[];
}

export interface GroupMember {
  userId: number;
  name: string;
  role: string;
  joinedAt: string;
  status: string;
  groupId: number;
}
