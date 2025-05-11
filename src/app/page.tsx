'use client';

import { useState } from 'react';
import { Card } from '@/app/components/Card';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';

interface Club {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  imageUrl?: string;
}

export default function HomePage() {
  const [myClubsRef] = useEmblaCarousel();
  const [recommendedRef] = useEmblaCarousel();

  const [myClubs] = useState<Club[]>([
    {
      id: '1',
      name: '개발자 스터디',
      description: '함께 성장하는 개발자 모임',
      memberCount: 15,
      category: '학술',
      imageUrl: 'https://placehold.co/600x400?text=개발자+스터디',
    },
    {
      id: '2',
      name: '축구 동아리',
      description: '주 2회 축구하는 모임',
      memberCount: 22,
      category: '운동',
      imageUrl: 'https://placehold.co/600x400?text=축구+동아리',
    },
    {
      id: '3',
      name: '영화 감상 모임',
      description: '매주 금요일 영화 감상 및 토론',
      memberCount: 18,
      category: '문화',
      imageUrl: 'https://placehold.co/600x400?text=영화+감상+모임',
    },
  ]);

  const [recommendedClubs] = useState<Club[]>([
    {
      id: '4',
      name: '독서 토론',
      description: '매주 한 권의 책을 읽고 토론하는 모임',
      memberCount: 12,
      category: '교양',
      imageUrl: 'https://placehold.co/600x400?text=독서+토론',
    },
    {
      id: '5',
      name: '기타 연주반',
      description: '초보자도 환영하는 기타 연주 모임',
      memberCount: 8,
      category: '음악',
      imageUrl: 'https://placehold.co/600x400?text=기타+연주반',
    },
    {
      id: '6',
      name: '사진 촬영반',
      description: '사진 촬영 및 편집 기술 공유',
      memberCount: 20,
      category: '예술',
      imageUrl: 'https://placehold.co/600x400?text=사진+촬영반',
    },
    {
      id: '7',
      name: '요리 연구회',
      description: '함께 요리하고 레시피 공유하는 모임',
      memberCount: 15,
      category: '취미',
      imageUrl: 'https://placehold.co/600x400?text=요리+연구회',
    },
  ]);

  const ClubCard = ({ club }: { club: Club }) => (
    <div className="carousel-slide">
      <Link href={`/groups/${club.id}`}>
        <Card className="h-full hover:shadow-lg transition-shadow">
          <div className="aspect-video w-full bg-gray-100 rounded-t-lg overflow-hidden">
            {club.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={club.imageUrl}
                alt={club.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">{club.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{club.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                {club.category}
              </span>
              <span>{club.memberCount}명</span>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="space-y-12 py-8">
        <section>
          <h2 className="text-2xl font-bold mb-6">내 동아리</h2>
          <div className="carousel-viewport overflow-hidden" ref={myClubsRef}>
            <div className="carousel-container flex gap-4">
              {myClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">추천 동아리</h2>
          <div
            className="carousel-viewport overflow-hidden"
            ref={recommendedRef}
          >
            <div className="carousel-container flex gap-4">
              {recommendedClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
