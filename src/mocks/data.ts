import type { User } from '@/types/user'

export const mockUser: User = {
  id: 1,
  name: '홍길동',
  email: 'user@example.com',
  role: 'USER',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockClubs = [
  {
    id: 1,
    name: '모각코',
    description: '모여서 각자 코딩',
    memberCount: 42,
  },
  {
    id: 2,
    name: '알고리즘 스터디',
    description: '알고리즘 문제 풀이',
    memberCount: 15,
  },
]
