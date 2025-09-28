import { Card } from '@/app/_components/Card';
import React, { useState } from 'react';
import Link from 'next/link';
import { GetGroupsResponse } from '../_types/group.types';
import RecruitmentBadge from '@/app/groups/components/RecruitmentBadge';

interface ClubCardProps {
  club: GetGroupsResponse['data'][0];
  className?: string;
  groupImageUrl: string | null;
}

const ClubCard = ({ club, className }: ClubCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`relative w-full h-[300px] ${
        className ?? ''
      }`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className="relative w-full h-full">
        {/* 앞면 */}
        <Link href={`/groups/${club.id}`}>
          <Card className={`flex flex-col cursor-pointer transition-all duration-300 absolute top-0 left-0 w-full h-full z-[2] ${
            isFlipped 
              ? 'shadow-2xl border-blue-500 scale-105' 
              : 'hover:shadow-lg hover:border-blue-500'
          }`}>
            <div className="aspect-video w-full bg-gray-100 rounded-t-lg overflow-hidden">
              {club.groupImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={club.groupImageUrl}
                  alt={club.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isFlipped ? 'scale-110' : ''
                  }`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-2">
                <h3 className={`text-blue-600 font-bold text-lg truncate flex-1 transition-colors duration-300 ${
                  isFlipped ? 'text-blue-800' : ''
                }`}>
                  {club.name}
                </h3>
                <div className="ml-2 flex-shrink-0">
                  <RecruitmentBadge 
                    status={
                      club.recruitStatus === 'ALWAYS_OPEN' ? 'always_open' :
                      club.recruitStatus === 'OPEN' ? 'recruiting' : 'closed'
                    } 
                    size="sm" 
                    variant="outline"
                  />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {club.description}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                <span>{club.memberCount}명</span>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default ClubCard;
