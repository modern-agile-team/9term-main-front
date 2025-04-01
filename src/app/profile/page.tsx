'use client'

import { useEffect, useState } from 'react'
import { getUser } from '@/lib/api/client'
import { User } from '@/types/models/user.types'

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser()
        setUser(response.data as User)
      } catch (err) {
        setError('프로필을 불러오는데 실패했습니다.')
        console.error('Failed to fetch user:', err)
      }
    }

    fetchUser()
  }, [])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">프로필</h1>
      <div>
        <p>이름: {user.name}</p>
        <p>이메일: {user.email}</p>
      </div>
    </div>
  )
}
