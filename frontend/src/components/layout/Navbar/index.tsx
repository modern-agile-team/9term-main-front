'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14">
          {/* 왼쪽 메뉴 */}
          <div className="flex space-x-8">
            <Link
              href="/groups"
              className={`inline-flex items-center px-1 border-b-2 font-medium ${
                isActive('/groups') 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              모임 목록
            </Link>
            <Link
              href="/groups/create"
              className={`inline-flex items-center px-1 border-b-2 font-medium ${
                isActive('/groups/create')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              모임 만들기
            </Link>
          </div>

          {/* 오른쪽 메뉴 */}
          <div className="flex items-center space-x-4">
            <Link
              href="/groups/my"
              className={`inline-flex items-center px-1 border-b-2 font-medium ${
                isActive('/groups/my')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              내 모임
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 