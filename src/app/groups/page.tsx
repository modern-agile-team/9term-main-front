'use client';

import { useState } from 'react';
import { GetGroupsResponse } from '../_types/group.types';
import { useQuery } from '@tanstack/react-query';
import { groupsQueries } from '@/app/groups/_queries';
import ClubCard from '@/app/_components/ClubCard';

export default function AllGroupsPage() {
  const { data, isLoading, isError } = useQuery(groupsQueries.groups());
  const clubs: GetGroupsResponse['data'] = data?.data ?? [];
  const [sortType, setSortType] = useState<'popular' | 'name'>('popular');

  const sortedClubs = [...clubs].sort((a, b) => {
    if (sortType === 'popular')
      return Number(b.memberCount) - Number(a.memberCount);
    if (sortType === 'name') return a.name.localeCompare(b.name, 'ko');
    return 0;
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>동아리 목록을 불러오지 못했습니다.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-16">
      <h1 className="text-2xl font-bold mb-6">전체 동아리</h1>
      <div className="flex justify-end mb-4">
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value as 'popular' | 'name')}
          className="border rounded px-2 py-1"
        >
          <option value="popular">인기순</option>
          <option value="name">이름순</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedClubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </div>
  );
}
