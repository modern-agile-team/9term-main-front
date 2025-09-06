import { Metadata } from 'next';
import ClientLayout from '@/app/_components/ClientLayout';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'MODONGGU',
  description: '모모, 동동, 구구와 함께하는 인덕대학교 동아리 플랫폼',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/main_img/모동구.webp', sizes: 'any', type: 'image/webp' },
    ],
    shortcut: '/favicon.ico',
    apple: '/main_img/모동구.webp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="scroll-smooth scroll-pt-16">
      <ClientLayout>{children}</ClientLayout>
    </html>
  );
}
