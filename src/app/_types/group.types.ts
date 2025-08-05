
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
  createdAt: string;
  memberCount: string;
}

export interface GetGroupsResponse {
  status: string;
  message: string;
  data: Group[];
}
