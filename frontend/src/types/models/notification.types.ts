export interface Notification {
  id: number
  type: 'post' | 'comment' | 'like' | 'mention'
  message: string
  isRead: boolean
  createdAt: string
  link?: string
}
