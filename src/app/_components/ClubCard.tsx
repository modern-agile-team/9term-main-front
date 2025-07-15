import { Card } from '@/app/_components/Card';
import Link from 'next/link';
import { GetGroupsResponse } from '../_types/group.types';
import React from 'react';

interface ClubCardProps {
  club: GetGroupsResponse['data'][0];
  className?: string;
}

const ClubCard: React.FC<ClubCardProps> = ({ club, className }) => (
  <Link href={`/groups/${club.id}`}>
    <Card
      className={`w-full h-[300px] flex flex-col hover:shadow-lg hover:border-blue-500 transition-shadow ${
        className ?? ''
      }`}
    >
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
);

export default ClubCard;
