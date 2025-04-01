'use client'

import Providers from '@/lib/providers'
import Navbar from '@/components/layout/Navbar'
import Banner from '@/components/common/Banner'
import '@/styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50">
        <Providers>
          {/* 헤더 영역 */}
          <header>
            <Navbar />
            <Banner />
          </header>

          {/* 메인 콘텐츠 영역 */}
          <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>

          {/* 푸터 영역 (필요한 경우 추가) */}
          {/* <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <p className="text-center text-gray-500">© 2024 모동구. All rights reserved.</p>
            </div>
          </footer> */}
        </Providers>
      </body>
    </html>
  )
}
