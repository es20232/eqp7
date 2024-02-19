import { User } from './auth'

export type Post = {
  id: number
  description?: string
  date: string
  postImages: string[]
  user: User
  totalLikes: number
  totalDeslikes: number
  totalComments: number
}
