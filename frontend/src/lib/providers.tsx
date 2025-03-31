'use client'

import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    // MSW 초기화 코드
    async function enableMocking() {
      if (process.env.NODE_ENV === 'development') {
        try {
          // 브라우저 환경에서만 실행
          if (typeof window !== 'undefined') {
            await import('@/mocks/msw')
            console.info('[MSW] Mocking enabled.')
          }
        } catch (err) {
          console.error('[MSW] Failed to initialize:', err)
        }
      }
    }

    enableMocking()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
