'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GetGroupsResponse } from '../_types/group.types';
import { useQuery } from '@tanstack/react-query';
import { groupsQueries } from '@/app/groups/_queries';
import ClubCard from '@/app/_components/ClubCard';
import CreateClubCard from '@/app/_components/CreateClub';

const heroImages = [
  '/main_img/cartoon.webp',
  '/main_img/hangang.webp',
  '/main_img/ttabong.webp',
  '/main_img/coding.webp',
  '/main_img/Orientation.webp',
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading, isError } = useQuery(groupsQueries.groups());
  const clubs: GetGroupsResponse['data'] = data?.data ?? [];
  const recommendedClubs = [...clubs]
    .sort((a, b) => Number(b.memberCount) - Number(a.memberCount))
    .slice(0, 5);
  const allClubs = clubs;

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>동아리 목록을 불러오지 못했습니다.</div>;

  return (
    <div className="max-w-6xl mx-auto px-1 pt-16">
      {/* 임시 공지사항
      <div className="mb-4">
        <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-green-500 font-medium text-sm">
                시스템 공지
              </span>
              <span className="text-gray-800 text-sm">
                모동구 서비스는 <span className="font-semibold">9/15</span>부터
                운영됩니다
              </span>
            </div>
            <span className="text-gray-500 text-xs">방금 전</span>
          </div>
        </div>
      </div> */}

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
            <Link href="/groups">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2 rounded-r-lg transition">
                검색
              </button>
            </Link>
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
        <section id="recommended-clubs">
          <h2 className="section-title font-bold text-[24px] text-[#424242] font-['Noto_Sans_KR',_sans-serif] pb-[5px] mb-[20px] relative inline-block">
            인기 동아리
            <span className="block absolute left-0 bottom-0 w-[60px] h-[3px] bg-blue-600" />
          </h2>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="grid grid-cols-4 gap-4 min-w-max px-2 py-2">
              {recommendedClubs.slice(0, 3).map((club) => (
                <ClubCard
                  key={club.id}
                  club={club}
                  groupImageUrl={club.groupImageUrl}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="all-clubs">
          <h2 className="section-title font-bold text-[24px] text-[#424242] font-['Noto_Sans_KR',_sans-serif] pb-[5px] mb-[20px] relative inline-block">
            모든 동아리
            <span className="block absolute left-0 bottom-0 w-[60px] h-[3px] bg-blue-600" />
            <Link href="/groups">
              <span className="text-gray-500 hover:text-blue-600  text-sm font-bold">
                ...더보기
              </span>
            </Link>
          </h2>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="grid grid-cols-4 gap-4 min-w-max px-2 py-2">
              <CreateClubCard />
              {allClubs.slice(0, 3).map((club) => (
                <ClubCard
                  key={club.id}
                  club={club}
                  groupImageUrl={club.groupImageUrl}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
      <div className="ad-container">
        <ins
          className="kakao_ad_area"
          data-ad-unit="DAN-NjV1yqePdLkoeUya"
          data-ad-width="728"
          data-ad-height="90"
        ></ins>
      </div>
      <div className="fixed top-20 right-2 z-40 ad-container">
        <ins
          className="kakao_ad_area"
          data-ad-unit="DAN-rcvRh5UE4QigBKdD"
          data-ad-width="160"
          data-ad-height="600"
        ></ins>
      </div>

      <script
        type="text/javascript"
        src="//t1.daumcdn.net/kas/static/ba.min.js"
        async
      ></script>
    </div>
  );
}
