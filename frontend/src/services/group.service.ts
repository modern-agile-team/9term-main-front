import { apiClient } from "@/lib/api/client";
import {
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
} from "@/types/models/group.types";

const BASE_URL = "/api/groups";

export const groupService = {
  // 동아리 목록 조회
  getGroups: async (): Promise<Group[]> => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
  },

  // 특정 동아리 조회
  getGroupById: async (groupId: number): Promise<Group> => {
    const response = await apiClient.get(`${BASE_URL}/${groupId}`);
    return response.data;
  },

  // 동아리 생성
  createGroup: async (data: CreateGroupRequest): Promise<Group> => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  // 동아리 수정
  updateGroup: async (
    groupId: number,
    data: UpdateGroupRequest
  ): Promise<Group> => {
    const response = await apiClient.put(`${BASE_URL}/${groupId}`, data);
    return response.data;
  },

  // 동아리 삭제
  deleteGroup: async (groupId: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${groupId}`);
  },

  // 동아리 게시글 목록 조회
  getGroupPosts: async (groupId: number): Promise<any[]> => {
    const response = await apiClient.get(`${BASE_URL}/${groupId}/posts`);
    return response.data;
  },
};
