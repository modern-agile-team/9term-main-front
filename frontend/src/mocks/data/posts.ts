import { Post } from '@/types/Post'

// 빈 게시글 데이터
export const posts: Post[] = [
  {
    id: 1,
    title: '주말 등산 모임',
    content: '이번 주말에 북한산 등산 가실 분 모집합니다.',
    author: {
      id: 1,
      username: '희민',
      role: '모임장',
    },
    location: '북한산',
    time: '2024-03-16 오전 9:00',
    tags: ['등산', '주말', '운동'],
    likes: 5,
    comments: 3,
    saved: false,
    createdAt: '2024-03-10T12:00:00Z',
    updatedAt: '2024-03-10T12:00:00Z',
  },
  {
    id: 2,
    title: '독서 모임 멤버 모집',
    content: '매주 토요일 오후에 진행되는 독서 모임입니다.',
    author: {
      id: 2,
      username: '지수',
      role: '회원',
    },
    location: '강남 스터디카페',
    time: '2024-03-15 오후 2:00',
    tags: ['독서', '토요일', '취미'],
    likes: 8,
    comments: 4,
    saved: true,
    createdAt: '2024-03-09T15:00:00Z',
    updatedAt: '2024-03-09T15:00:00Z',
  },
]
