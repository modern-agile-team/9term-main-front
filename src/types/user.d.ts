export interface User {
  id: number
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  createdAt: string
  updatedAt: string
}

