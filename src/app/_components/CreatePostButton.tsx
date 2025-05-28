import { useRouter } from 'next/navigation';

export default function CreatePostButton() {
  const router = useRouter();
  return (
    <div>
      <button
        className="flex items-center justify-center w-full py-2  bg-blue-600 text-white rounded-lg font-medium"
        onClick={() => router.push('/Posts/Create')}
      >
        <span className="mr-2">✏️</span> 새 게시글 작성하기
      </button>
    </div>
  );
}
