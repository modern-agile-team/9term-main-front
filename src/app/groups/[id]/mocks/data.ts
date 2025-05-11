import type { User } from '@/app/types/user.types';

export const mockUser: User = {
  id: 1,
  name: '홍길동',
  email: 'user@example.com',
  role: 'USER',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export interface Group {
  id: number;
  name: string;
  description: string;
  memberCount: number;
}

export const mockGroups: Group[] = [
  {
    id: 1,
    name: '개발자 스터디',
    description: '함께 성장하는 개발자 모임',
    memberCount: 32,
  },
  {
    id: 2,
    name: '알고리즘 스터디',
    description: '알고리즘 문제 풀이',
    memberCount: 15,
  },
];
