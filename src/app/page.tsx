'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/app/_components/Card';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { GetGroupsResponse } from './_types/group.types';
import { useQuery } from '@tanstack/react-query';
import { groupsQueries } from '@/app/groups/_queries'; 
const heroImages = [
  '/main_img/cartoon.webp',
  '/main_img/hangang.webp',
  '/main_img/ttabong.webp',
  '/main_img/coding.webp',
  '/main_img/Orientation.webp',
];

export default function HomePage() {
  const [allClubsRef] = useEmblaCarousel();
  const [recommendedRef] = useEmblaCarousel();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const { data, isLoading, isError } = useQuery(groupsQueries.groups());
  const clubs : GetGroupsResponse['data'] = data?.data??[];
  const recommendedClubs = [...clubs]
  .sort((a, b) => Number(b.memberCount) - Number(a.memberCount))
  .slice(0, 5);
  const allClubs = clubs;
  

  const ClubCard = ({ club }: { club: GetGroupsResponse['data'][0] }) => (
    <div className="carousel-slide">
      <Link href={`/groups/${club.id}`}>
        <Card className="w-[300px] h-[300px] hover:shadow-lg hover:border-blue-500 transition-shadow flex flex-col">
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
          <div className="p-4 flex-1 flex-col justify-between">
            <h3 className="text-blue-600 font-bold text-lg mb-2">
              {club.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{club.description}</p>
              <h2 className="rounded-full w-[260px] h-[3px] bg-gray-200" />
            <div className="flex justify-between items-center text-sm text-gray-500">
              {/* <span className="px-2 py-1 bg-gray-100 rounded-full">
                {club.category || '카테고리 없음'}
              </span> */}
              <span>{club.memberCount}명</span>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>동아리 목록을 불러오지 못했습니다.</div>;

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
            인덕대학교의 다양한 동아리를 한 곳에서 만나보세요!
          </p>
          <div className="hidden md:flex bg-white rounded-lg shadow  w-2/5 mx-auto ">
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
            인기 동아리
            <span className="block absolute left-0 bottom-0 w-[60px] h-[3px] bg-blue-600" />
          </h2>
          <div
            className="carousel-viewport overflow-x-auto scrollbar-hide"
            ref={recommendedRef}
          >
            <div className="flex gap-2 md:gap-4">
              {recommendedClubs.map((club: any) => (
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
           전체 동아리
            <span className="block absolute left-0 bottom-0 w-[60px] h-[3px] bg-blue-600" />
          </h2>
          <div
            className="carousel-viewport overflow-x-auto scrollbar-hide"
            ref={allClubsRef}
          >
            <div className="flex gap-2 md:gap-4">
              {allClubs.map((club: any) => (
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
