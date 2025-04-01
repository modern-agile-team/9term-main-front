export interface Author {
  id: number;
  username: string;
  role: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: Author;
  category: "공지" | "자유게시판" | "일정" | "통계";
  createdAt: string;
  updatedAt: string;
  location?: string;
  time?: string;
  tags: string[];
  likes: number;
  comments: number;
  saved: boolean;
}

export const mockPosts: Post[] = [
  {
    id: 1,
    title: "3월 정기 모임 안내",
    content: "이번 달 정기 모임은 3월 15일 오후 7시입니다.",
    author: {
      id: 1,
      username: "admin",
      role: "ADMIN",
    },
    category: "공지",
    location: "서울특별시 강남구 테헤란로 123",
    time: "2024-03-15 19:00",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["정기모임", "오프라인"],
    likes: 5,
    comments: 2,
    saved: false,
  },
  {
    id: 2,
    title: "스터디 자료 공유",
    content: "오늘 스터디에서 다룬 알고리즘 문제 풀이 자료 공유드립니다.",
    author: {
      id: 2,
      username: "member1",
      role: "MEMBER",
    },
    category: "자유게시판",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["알고리즘", "스터디"],
    likes: 3,
    comments: 1,
    saved: false,
  },
  {
    id: 3,
    title: "4월 스터디 일정",
    content: "4월 스터디는 매주 화요일 저녁 7시에 진행됩니다.",
    author: {
      id: 1,
      username: "admin",
      role: "ADMIN",
    },
    category: "일정",
    location: "서울특별시 강남구 테헤란로 123",
    time: "2024-04-02 19:00",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["일정", "4월"],
    likes: 2,
    comments: 0,
    saved: false,
  },
  {
    id: 4,
    title: "3월 스터디 참석률",
    content: "3월 스터디 평균 참석률은 85%입니다.",
    author: {
      id: 1,
      username: "admin",
      role: "ADMIN",
    },
    category: "통계",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["통계", "3월"],
    likes: 1,
    comments: 0,
    saved: false,
  },
];
