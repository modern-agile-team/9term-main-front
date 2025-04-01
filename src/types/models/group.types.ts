export interface Group {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  id: number;
  userId: number;
  groupId: number;
  role: "admin" | "member";
  joinedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  description: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}
