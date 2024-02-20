import { User } from './auth'

type PostImage = {
  id: number
  image: string
  imageUrl: string
}

export type Post = {
  id: number
  description?: string
  date: string
  postImages: PostImage[]
  user: User
  totalLikes: number
  totalComments: number
  hasUserLiked: boolean
  hasUserDisliked: boolean
}

export type Comment = {
  id: number
  comment: string
  date: string
  user: User
}
