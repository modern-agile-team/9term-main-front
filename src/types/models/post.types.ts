export interface Post {
  id: number
  title: string
  content: string
  author: {
    id: number
    username: string
    role: string
  }
  location?: string
  time?: string
  tags: string[]
  likes: number
  comments: number
  saved: boolean
  createdAt: string
  updatedAt: string
}
