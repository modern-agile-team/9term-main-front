'use client';

import { useMemo, useState } from 'react';
import { GetGroupsResponse } from '../_types/group.types';
import { useQuery } from '@tanstack/react-query';
import { groupsQueries } from '@/app/groups/_queries';
import ClubCard from '@/app/_components/ClubCard';

export default function   AllGroupsPage() {
  const { data, isLoading, isError } = useQuery(groupsQueries.groups());
  const clubs: GetGroupsResponse['data'] = data?.data ?? [];
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState<'popular' | 'name'>('name');
  const filteredClubs = useMemo(() => {
    if (!searchTerm.trim()) return clubs;
    return clubs.filter(club =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clubs, searchTerm]);

  const sortedAndFilteredClubs = useMemo(() => {
    return [...filteredClubs].sort((a, b) => {
      if (sortType === 'popular')
        return Number(b.memberCount) - Number(a.memberCount);
      if (sortType === 'name') 
        return a.name.localeCompare(b.name, 'ko');
      return 0;
    });
  }, [filteredClubs, sortType]);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>동아리 목록을 불러오지 못했습니다.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-16">
      {/* 검색창 */}
      <div className="hidden md:flex bg-white rounded-lg shadow w-3/5 mx-auto mb-6">
        <input
          type="text"
          placeholder="관심있는 동아리나 활동을 검색해보세요"
          className="flex-1 px-3 py-2 rounded-l-lg outline-none text-gray-700 text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2 rounded-r-lg transition"
          onClick={() => {
          }}
        >
          검색
        </button>
      </div>
      {/* 모바일 검색창 */}
      <div className="md:hidden bg-white rounded-lg shadow mx-4 mb-6">
        <input
          type="text"
          placeholder="동아리 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-lg outline-none text-gray-700 text-base"
        />
      </div>
      {/* 정렬 옵션 */}
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
      {/* 동아리 목록 */}
      {sortedAndFilteredClubs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchTerm ? (
            <>
              <p className="text-lg mb-2">'{searchTerm}'에 대한 검색 결과가 없습니다.</p>
              <p>다른 키워드로 검색해보세요.</p>
            </>
          ) : (
            <p>동아리가 없습니다.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedAndFilteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}
    </div>
  );
}