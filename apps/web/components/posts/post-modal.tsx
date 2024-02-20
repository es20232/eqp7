'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { usePostModalStore } from '@/hooks/use-post-modal-store'
import { PostCarousel } from './post-carousel'
import { CommentSection } from './comment-section'

export function PostModal() {
  const { post, isOpen, setIsOpen } = usePostModalStore()

  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[98svh] max-w-[90vw]">
        <main className="flex h-full space-x-8 ">
          <PostCarousel postImages={post?.postImages} />
          <CommentSection />
        </main>
      </DialogContent>
    </Dialog>
  )
}
