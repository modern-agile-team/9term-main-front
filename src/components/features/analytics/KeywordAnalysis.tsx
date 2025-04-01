export default function KeywordAnalysis() {
  return (
    <div>
      <h3 className="text-lg font-bold mb-3">
        <span className="mr-2">🔍</span> 키워드 분석
      </h3>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          스터디
        </span>
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
          React
        </span>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          워크숍
        </span>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
          API
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-50 p-2 rounded-md text-center">
          <div className="text-sm font-medium">주차</div>
        </div>
        <div className="bg-gray-50 p-2 rounded-md text-center">
          <div className="text-sm font-medium">장소변경</div>
        </div>
        <div className="bg-gray-50 p-2 rounded-md text-center">
          <div className="text-sm font-medium">자료</div>
        </div>
        <div className="bg-gray-50 p-2 rounded-md text-center">
          <div className="text-sm font-medium">Hooks</div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-sm text-gray-500">강남역</div>
      </div>
    </div>
  )
}
