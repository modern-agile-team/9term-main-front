'use client'

import { useState, useMemo } from 'react'

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토']

// 임시 일정 데이터
const SAMPLE_EVENTS = [
  {
    date: '2024-03-15',
    title: '스터디 모임',
    type: 'study',
  },
  {
    date: '2024-03-20',
    title: '프로젝트 발표',
    type: 'presentation',
  },
  {
    date: '2024-03-25',
    title: '코드 리뷰',
    type: 'review',
  },
]

// 달력에 표시할 날짜 배열을 생성하는 함수
const generateCalendarDates = (currentDate: Date) => {
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  )

  const dates = []
  const firstDayIndex = firstDayOfMonth.getDay()

  // 이전 달의 마지막 날짜들 추가
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), -i)
    dates.push({
      date,
      isCurrentMonth: false,
    })
  }

  // 현재 달의 날짜들 추가
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
    dates.push({
      date,
      isCurrentMonth: true,
    })
  }

  // 다음 달의 시작 날짜들 추가
  const remainingDays = 42 - dates.length // 6주 x 7일 = 42
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      i
    )
    dates.push({
      date,
      isCurrentMonth: false,
    })
  }

  return dates
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  // 달력 날짜 배열을 메모이제이션
  const dates = useMemo(() => generateCalendarDates(currentDate), [currentDate])

  // 이전 달로 이동
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
  }

  // 다음 달로 이동
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  }

  // 해당 날짜의 일정 가져오기
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return SAMPLE_EVENTS.filter((event) => event.date === dateString)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* 달력 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ◀
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ▶
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="text-center py-2 font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* 달력 날짜 */}
      <div className="grid grid-cols-7 gap-1">
        {dates.map(({ date, isCurrentMonth }, index) => {
          const events = getEventsForDate(date)
          const isToday = date.toDateString() === new Date().toDateString()

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border rounded-lg ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
              } ${isToday ? 'border-blue-500' : 'border-gray-100'}`}
            >
              <div className="text-right mb-1">{date.getDate()}</div>
              {events.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className={`text-xs p-1 mb-1 rounded ${
                    event.type === 'study'
                      ? 'bg-blue-100 text-blue-800'
                      : event.type === 'presentation'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {event.title}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
