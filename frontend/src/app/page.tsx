'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface Club {
  id: string
  name: string
  description: string
  memberCount: number
  category: string
  imageUrl?: string
}

export default function HomePage() {
  const [myClubs] = useState<Club[]>([
    {
      id: '1',
      name: '개발자 스터디',
      description: '함께 성장하는 개발자 모임',
      memberCount: 15,
      category: '학술',
      imageUrl: '/images/dev-study.jpg',
    },
    {
      id: '2',
      name: '축구 동아리',
      description: '주 2회 축구하는 모임',
      memberCount: 22,
      category: '운동',
      imageUrl: '/images/soccer.jpg',
    },
    {
      id: '3',
      name: '영화 감상 모임',
      description: '매주 금요일 영화 감상 및 토론',
      memberCount: 18,
      category: '문화',
      imageUrl: '/images/movie.jpg',
    },
  ])

  const [recommendedClubs] = useState<Club[]>([
    {
      id: '4',
      name: '독서 토론',
      description: '매주 한 권의 책을 읽고 토론하는 모임',
      memberCount: 12,
      category: '교양',
      imageUrl: '/images/book.jpg',
    },
    {
      id: '5',
      name: '기타 연주반',
      description: '초보자도 환영하는 기타 연주 모임',
      memberCount: 8,
      category: '음악',
      imageUrl: '/images/guitar.jpg',
    },
    {
      id: '6',
      name: '사진 촬영반',
      description: '사진 촬영 및 편집 기술 공유',
      memberCount: 20,
      category: '예술',
      imageUrl: '/images/photo.jpg',
    },
    {
      id: '7',
      name: '요리 연구회',
      description: '함께 요리하고 레시피 공유하는 모임',
      memberCount: 15,
      category: '취미',
      imageUrl: '/images/cooking.jpg',
    },
  ])

  const ClubCard = ({ club }: { club: Club }) => (
    <Link href={`/clubs/${club.id}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-video w-full bg-gray-100 rounded-md mb-4">
          {club.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={club.imageUrl}
              alt={club.name}
              className="w-full h-full object-cover rounded-md"
            />
          )}
        </div>
        <h3 className="font-bold text-lg">{club.name}</h3>
        <p className="text-gray-600 text-sm mt-2">{club.description}</p>
        <div className="flex justify-between mt-4 text-sm text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded-full">
            {club.category}
          </span>
          <span>{club.memberCount}명</span>
        </div>
      </Card>
    </Link>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6">내 동아리</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">추천 동아리</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
