'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/app/_components/Card';
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
const heroImages = [
  '/main_img/cartoon.webp',
  '/main_img/hangang.webp',
  '/main_img/ttabong.webp',
  '/main_img/coding.webp',
  '/main_img/Orientation.webp',
];

export default function HomePage() {
  const [myClubsRef] = useEmblaCarousel();
  const [recommendedRef] = useEmblaCarousel();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const [myClubs] = useState<Club[]>([
    {
      id: '1',
      name: '개발자 스터디',
      description: '함께 성장하는 개발자 모임',
      memberCount: 15,
      category: '학술',
      imageUrl: '/main_img/coding.webp',
    },
    {
      id: '2',
      name: '밥 한끼',
      description: '주 2회 밥먹는 모임',
      memberCount: 22,
      category: '식사',
      imageUrl: '/main_img/ttabong.webp',
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
        <Card className="h-full hover:shadow-lg hover:border-blue-500 transition-shadow ">
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
            <h3 className="text-blue-600 font-bold text-lg mb-2">
              {club.name}
            </h3>
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
    <div className="max-w-6xl mx-auto px-1 pt-16">
      <section className="relative rounded-2xl h-[340px] md:h-[400px] flex flex-col justify-center items-center text-white text-center shadow-lg mb-8 overflow-hidden">
        {heroImages.map((img, idx) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === current ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
            style={{
              backgroundImage: `url('${img}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r  opacity-70 z-10" />
        <div className="relative z-20 flex flex-col items-center w-full">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 drop-shadow-lg shadow-black">
            당신의 취미와 열정을 함께할 동아리를 찾아보세요
          </h1>
          <p className="text-base md:text-lg mb-6 max-w-xl mx-auto drop-shadow">
            학교, 직장, 지역 동아리까지 다양한 모임을 한 곳에서 만나보세요!
          </p>
          <div className="bg-white rounded-lg shadow flex w-2/5 mx-auto ">
            <input
              type="text"
              placeholder="관심있는 동아리나 활동을 검색해보세요"
              className="flex-1 px-3 py-2 rounded-l-lg outline-none text-gray-700 text-base"
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2 rounded-r-lg transition">
              검색
            </button>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300
        ${current === idx ? 'bg-white shadow-lg scale-125' : 'bg-white/50'}
      `}
            />
          ))}
        </div>
      </section>

      <div className="space-y-12 py-8">
        <section id="my-clubs">
          <h2 className="section-title font-bold text-[24px] text-[#424242] font-['Noto_Sans_KR',_sans-serif] pb-[5px] mb-[20px] relative inline-block">
            내 동아리
            <span className="block absolute left-0 bottom-0 w-[60px] h-[3px] bg-blue-600" />
          </h2>
          <div
            className="carousel-viewport overflow-x-auto scrollbar-hide"
            ref={myClubsRef}
          >
            <div className="flex gap-2 md:gap-4">
              {myClubs.map((club) => (
                <div
                  key={club.id}
                  className="min-w-[70vw] max-w-xs sm:min-w-[40vw] md:min-w-[220px] md:max-w-xs"
                >
                  <ClubCard club={club} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="recommended-clubs">
          <h2 className="section-title font-bold text-[24px] text-[#424242] font-['Noto_Sans_KR',_sans-serif] pb-[5px] mb-[20px] relative inline-block">
            인기 동아리
            <span className="block absolute left-0 bottom-0 w-[60px] h-[3px] bg-blue-600" />
          </h2>
          <div
            className="carousel-viewport overflow-x-auto scrollbar-hide"
            ref={recommendedRef}
          >
            <div className="flex gap-2 md:gap-4">
              {recommendedClubs.map((club) => (
                <div
                  key={club.id}
                  className="min-w-[70vw] max-w-xs sm:min-w-[40vw] md:min-w-[220px] md:max-w-xs"
                >
                  <ClubCard club={club} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
