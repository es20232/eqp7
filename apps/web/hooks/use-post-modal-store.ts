import { Post } from '@/types/post'
import { create } from 'zustand'

interface PostModalStore {
  post?: Post
  isOpen: boolean
  setIsOpen: (b: boolean) => void
  setPost: (p: Post) => void
}

export const usePostModalStore = create<PostModalStore>()((set) => ({
  isOpen: false,
  setIsOpen: (value) => set((state) => ({ ...state, isOpen: value })),
  setPost: (post) => set((state) => ({ ...state, post })),
}))
