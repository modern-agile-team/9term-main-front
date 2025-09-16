

export interface MyGroup {
  groupId: number;
  groupName: string;
  groupImgUrl: string;
  role: 'MEMBER' | 'MANAGER' | 'ADMIN';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  joinedAt: string;
}

export interface MyGroupsResponse {
  status: 'success' | 'error';
  message: string;
  data: MyGroup[];
}
