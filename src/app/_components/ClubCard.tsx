import { Card } from '@/app/_components/Card';
import React, { useState } from 'react';
import Link from 'next/link';
import { GetGroupsResponse } from '../_types/group.types';

interface ClubCardProps {
  club: GetGroupsResponse['data'][0];
  className?: string;
}

const ClubCard: React.FC<ClubCardProps> = ({ club, className }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`relative w-full h-[300px] perspective-1000 ${
        className ?? ''
      }`}
      style={{ perspective: 1000, overflow: 'visible' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'none',
        }}
      >
        {/* 앞면 */}
        <Link href={`/groups/${club.id}`}>
          <Card className="flex flex-col cursor-pointer hover:shadow-lg hover:border-blue-500 transition-shadow absolute top-0 left-0 w-full h-full z-[2] [backface-visibility:hidden]">
            <div className="aspect-video w-full bg-gray-100 rounded-t-lg overflow-hidden">
              {club.groupImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={club.groupImage}
                  alt={club.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <h3 className="text-blue-600 font-bold text-lg mb-2 truncate">
                {club.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {club.description}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                <span>{club.memberCount}명</span>
              </div>
            </div>
          </Card>
        </Link>
        <Card className="flex flex-col items-center justify-center absolute top-0 left-0 w-full h-full z-[3] [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div
            className="absolute inset-0 w-full h-full rounded-lg bg-white"
            style={{ zIndex: 1 }}
          />
          <p className="text-gray-600 text-base text-center px-6 relative z-10 mb-16">
            {club.description}
          </p>

          <Link
            href={`/groups/${club.id}`}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
          >
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow transition-colors"
              type="button"
            >
              더 알아보기
            </button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default ClubCard;
