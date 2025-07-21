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
      <ClubCreateModal isOpen={isOpen} onClose={() => setIsOpen(false)} 
        />
      <div 
        className={`w-full h-[300px] cursor-pointer ${className}`}
        onClick={handleCreateClub}
      >
      <Card
        className={`w-full h-[300px] flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:border-blue-500 transition-shadow ${className}`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span className="text-blue-600 font-bold text-lg">동아리 생성</span>
        </div>
      </Card>
      </div>
    </>
  );
}
