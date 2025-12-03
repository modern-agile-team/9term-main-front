'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

const heroImages = [
  '/main_img/cartoon.webp',
  '/main_img/hangang.webp',
  '/main_img/coding.webp',
  '/main_img/Orientation.webp',
];
const characterFeatures = [
  {
    image: '/main_img/모모.webp',
    name: '모모',
    description: '친근하고 따뜻한 모모와 함께!',
    personality: '친근함',
    color: 'from-pink-400 to-rose-500',
  },
  {
    image: '/main_img/동동.webp',
    name: '동동',
    description: '활발하고 에너지 넘치는 동동과 함께!',
    personality: '활발함',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    image: '/main_img/구구.webp',
    name: '구구',
    description: '똑똑하고 창의적인 구구와 함께!',
    personality: '창의성',
    color: 'from-purple-400 to-indigo-500',
  },
];

const features = [
  {
    icon: '🎯',
    title: '동아리 발견',
    description: '다양한 분야의 동아리를 쉽게 찾고 가입할 수 있습니다.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '💬',
    title: '실시간 소통',
    description: '동아리원들과 게시글과 댓글로 활발하게 소통하세요.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: '📢',
    title: '공지사항',
    description: '중요한 공지사항을 상단에 고정하여 놓치지 마세요.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: '❤️',
    title: '좋아요 & 댓글',
    description: '게시글에 좋아요를 누르고 댓글로 의견을 나누세요.',
    gradient: 'from-rose-500 to-pink-200',
  },
  {
    icon: '👥',
    title: '멤버 관리',
    description: '동아리 멤버를 초대하고 관리할 수 있습니다.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: '📱',
    title: '모바일 친화적',
    description: '언제 어디서나 모바일로 편리하게 이용하세요.',
    gradient: 'from-indigo-500 to-blue-500',
  },
];
const SERVICE_START_DATE = new Date('2025-01-01T00:00:00');

export default function IntroPage() {
  const [current, setCurrent] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section-id');
          if (sectionId) {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => new Set(prev).add(sectionId));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, []);

  const setSectionRef = (sectionId: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[sectionId] = el;
  };

  const calculateUptime = () => {
    const now = new Date();
    const diff = now.getTime() - SERVICE_START_DATE.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const uptime = calculateUptime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Skip Intro Button */}
        <div className="flex justify-end mb-8">
          <Link href="/home">
            <button className="group relative px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300">
              <span className="relative z-10 flex items-center gap-2">
                <span>동아리 둘러보기</span>
                <span className="text-lg group-hover:rotate-90 transition-transform duration-300">
                  →
                </span>
              </span>
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"></div>
            </button>
          </Link>
        </div>

        {/* Hero Section */}
        <section
          ref={setSectionRef('hero')}
          data-section-id="hero"
          className={`relative rounded-3xl h-[600px] md:h-[700px] flex flex-col justify-center items-center text-white text-center shadow-2xl mb-24 overflow-hidden transition-all duration-1000 ${
            visibleSections.has('hero')
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform translate-y-10'
          }`}
        >
          {heroImages.map((img, idx) => (
            <div
              key={img}
              className={`absolute inset-0 transition-all duration-1000 ${
                idx === current
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-110'
              }`}
              style={{
                backgroundImage: `url('${img}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/60" />
          <div className="relative z-20 flex flex-col items-center w-full px-6">
            <h1 className="text-4xl md:text-7xl font-bold mb-8 drop-shadow-2xl leading-tight">
              인덕대학교
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                동아리 플랫폼
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto drop-shadow-lg leading-relaxed font-light">
              모모, 동동, 구구와 함께하는 즐거운 동아리 활동!
              <br />
              새로운 친구들과 함께 특별한 추억을 만들어보세요.
            </p>
            <div className="flex flex-col md:flex-row gap-6 mb-12">
              <Link href="/home">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-2xl transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
                  <span className="relative z-10 flex items-center gap-2">
                    동아리 둘러보기
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
              <Link href="/login">
                <button className="group px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold rounded-2xl transition-all duration-300 text-lg border border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-105">
                  <span className="flex items-center gap-2">
                    회원가입
                    <svg
                      className="w-5 h-5 group-hover:rotate-12 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  current === idx
                    ? 'bg-white shadow-lg scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Character Introduction Section */}
        <section
          ref={setSectionRef('characters')}
          data-section-id="characters"
          className={`mb-24 transition-all duration-1000 ${
            visibleSections.has('characters')
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform translate-y-10'
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              모동구의 특별한 친구들을 만나보세요!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              각각의 개성 넘치는 캐릭터들과 함께 동아리 활동을 더욱 즐겁게
              만들어보세요
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {characterFeatures.map((character, index) => (
              <div
                key={index}
                className={`group relative bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-white/20 ${
                  visibleSections.has('characters')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r ${character.color} text-white text-sm font-semibold rounded-full shadow-lg`}
                    >
                      {character.personality}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                    {character.name}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed font-light text-sm">
                    {character.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section
          ref={setSectionRef('features')}
          data-section-id="features"
          className={`mb-24 transition-all duration-1000 ${
            visibleSections.has('features')
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform translate-y-10'
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              왜{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                인덕대 동아리 플랫폼
              </span>
              인가요?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              학생들의 동아리 활동을 더욱 활발하고 편리하게 만들어드립니다
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-white/20 ${
                  visibleSections.has('features')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section
          ref={setSectionRef('stats')}
          data-section-id="stats"
          className={`relative mb-24 transition-all duration-1000 ${
            visibleSections.has('stats')
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform translate-y-10'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-3xl shadow-2xl"></div>
          <div className="relative z-10 py-16 px-8 text-white text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              인덕대 동아리 플랫폼 현황
            </h2>
            <p className="text-xl mb-12 opacity-90 font-light">
              많은 학생들이 이미 이용하고 있습니다
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { number: '50+', label: '등록된 동아리', icon: '🏢' },
                { number: '1000+', label: '활동 중인 멤버', icon: '👥' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ${
                    visibleSections.has('stats')
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: `${index * 200}ms`,
                  }}
                >
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-lg opacity-90 font-light">
                    {stat.label}
                  </div>
                </div>
              ))}
              {/* Service Uptime Timer */}
              <div
                className={`transition-all duration-700 ${
                  visibleSections.has('stats')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: '400ms',
                }}
              >
                <div className="text-4xl mb-4">⏱️</div>
                <div className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent font-mono">
                  {uptime.days}일 {uptime.hours}시간
                  <br />
                  {uptime.minutes}분 {uptime.seconds}초
                </div>
                <div className="text-lg opacity-90 font-light">
                  서비스 운영 시간
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Combined Showcase & CTA Section */}
        <section
          ref={setSectionRef('showcase')}
          data-section-id="showcase"
          className={`relative transition-all duration-1000 ${
            visibleSections.has('showcase')
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform translate-y-10'
          }`}
        >
          <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl"></div>
          <div className="relative z-10 py-16 px-8 text-gray-900 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              함께라면 더욱 즐거워요!
            </h2>
            <p className="text-xl mb-8 text-gray-600 font-light">
              모동구와 함께 특별한 동아리 활동을 경험해보세요
            </p>
            <div className="flex justify-center mb-12">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-2xl">
                <img
                  src="/main_img/모동구.webp"
                  alt="모동구"
                  className="w-56 h-56 object-cover"
                />
              </div>
            </div>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto mb-12">
              각자의 개성을 살리면서도 함께할 때 더욱 빛나는 우리들의 동아리
              활동!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link href="/register">
                <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-2xl transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
                  <span className="flex items-center gap-2">
                    무료 회원가입
                    <svg
                      className="w-5 h-5 group-hover:rotate-12 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </span>
                </button>
              </Link>
              <Link href="/home">
                <button className="group px-8 py-4 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl transition-all duration-300 text-lg">
                  <span className="flex items-center gap-2">
                    동아리 둘러보기
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
