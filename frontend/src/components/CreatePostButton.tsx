export default function CreatePostButton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <button className="w-full py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center">
        <span className="mr-2">✏️</span> 새 게시글 작성하기
      </button>
    </div>
  );
}
