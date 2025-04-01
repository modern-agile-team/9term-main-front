export interface Author {
  id: number
  username: string
  role: string
}

export interface Post {
  id: number
  title: string
  content: string
  author: Author
  createdAt: string
  category: '공지' | '자유'
  location?: string
  time?: string
  tags: string[]
  likes: number
  comments: number
  saved: boolean
}
