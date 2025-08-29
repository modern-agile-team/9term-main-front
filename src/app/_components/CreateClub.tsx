import { Card } from '@/app/_components/Card';
import ClubCreateModal from '../groups/components/posts/CreateClubModal';
import { useState } from 'react';
import { useAuth } from '../_services/auth-provider';

export default function CreateClubCard({
  className = '',
}: {
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const handleCreateClub = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해 주세요.');
      return;
    }
    setIsOpen(true);
  };
  return (
    <>
      <ClubCreateModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div
        className={`relative w-full h-[300px] ${className}`}
        onClick={handleCreateClub}
      >
        <Card className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:border-blue-500 transition-shadow">
          <div className="flex flex-col items-center justify-center h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-12 h-12 text-blue-600 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span className="text-blue-600 font-bold text-lg">동아리 생성</span>
            <span className="text-gray-500 text-sm mt-2">
              새로운 동아리를 만들어보세요
            </span>
          </div>
        </Card>
      </div>
    </>
  );
}
