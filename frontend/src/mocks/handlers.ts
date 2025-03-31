import { http } from 'msw'
import { posts } from '@/mocks/data/posts'
import type { Post } from '@/types/models/post.types'

export const handlers = [
  // 로그인 API Mock
  http.post('/api/login', async () => {
    return new Response(
      JSON.stringify({
        token: 'mock-token-123',
        user: { id: 1, name: '희민' },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }),

  // 유저 정보 가져오기
  http.get('/api/user', async () => {
    return new Response(
      JSON.stringify({ id: 1, name: '희민', email: 'test@example.com' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }),

  // 게시물 리스트 (커뮤니티 게시글로 변경)
  http.get('/api/posts', ({ request }) => {
    const url = new URL(request.url)
    const tag = url.searchParams.get('tag')

    // 태그로 필터링
    let filteredPosts = posts
    if (tag && tag !== '전체') {
      filteredPosts = posts.filter((post) => post.tags.includes(tag))
    }

    return new Response(JSON.stringify(filteredPosts), {
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  // 특정 게시글 가져오기
  http.get('/api/posts/:id', ({ params }) => {
    const { id } = params
    const post = posts.find((p) => p.id === Number(id))

    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    return new Response(JSON.stringify(post), {
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  // 게시글 작성하기
  http.post('/api/posts', async ({ request }) => {
    const newPost = (await request.json()) as Post
    const post = {
      ...newPost,
      id: posts.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    posts.push(post)

    return new Response(JSON.stringify(post), {
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  // 게시글 좋아요 토글
  http.patch('/api/posts/:id/like', ({ params }) => {
    const { id } = params
    const post = posts.find((p) => p.id === Number(id))

    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    post.likes += 1
    return new Response(JSON.stringify({ liked: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  // 게시글 저장 토글
  http.patch('/api/posts/:id/save', ({ params }) => {
    const { id } = params
    const post = posts.find((p) => p.id === Number(id))

    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    post.saved = !post.saved
    return new Response(JSON.stringify({ saved: post.saved }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }),
]
