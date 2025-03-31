async function initMocks() {
  if (typeof window === 'undefined') {
    return
  }

  if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
    const { worker } = await import('@/mocks/browser')
    return worker.start({
      onUnhandledRequest: 'bypass', // 처리되지 않은 요청은 무시
    })
  }
}
