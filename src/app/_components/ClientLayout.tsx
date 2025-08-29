'use client';

import Image from 'next/image';
import { FaYoutube, FaGithub } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import Providers from '@/app/_services/providers';
import Navbar from '@/app/_components/Navbar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <body className="flex flex-col min-h-screen bg-gray-50 ">
      <Providers>
        <header>
          <Navbar />
        </header>
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
          {children}
        </main>
        {!isAuthPage && (
          <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto w-full px-4 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <span className="font-semibold text-gray-700">
                    모던애자일
                  </span>
                  <a
                    href="/privacy"
                    className="hover:underline text-gray-500 text-sm"
                  >
                    개인정보처리방침/이용약관
                  </a>
                  <a
                    href="https://open.kakao.com/o/sAfGpANh"
                    className="hover:underline text-gray-500 text-sm"
                  >
                    문의
                  </a>
                  <a
                    href="https://www.modonggu.site/"
                    className="hover:underline text-gray-500 text-sm"
                  >
                    ©모동구
                  </a>
                </div>
                <div className="flex space-x-4">
                  <a
                    href="https://www.youtube.com/channel/UC99JTVHdVLVWpCjVrm1jzMw"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="유튜브"
                  >
                    <FaYoutube className="w-6 h-6 hover:text-red-500 transition" />
                  </a>
                  <a
                    href="https://github.com/modern-agile-team"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="깃허브"
                  >
                    <FaGithub className="w-6 h-6 hover:text-gray-500 transition" />
                  </a>
                  <a
                    href="https://modern-agile-official-client.vercel.app/"
                    aria-label="회사"
                  >
                    <Image
                      src="/main_img/modernagile-logo.png"
                      alt="모던애자일"
                      width={24}
                      height={24}
                      className="w-7 h-7 border border-transparent hover:border-blue-500 rounded-full transition"
                    />
                  </a>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-400">
                {/* 모던애자일 | 사업자등록번호 : 000-00-00000 */}
              </div>
            </div>
          </footer>
        )}
      </Providers>
    </body>
  );
}
