'use client'

import { usePostModalStore } from '@/hooks/use-post-modal-store'
import { Post } from '@/types/post'
import { GalleryHorizontalEnd } from 'lucide-react'
import Image from 'next/image'

export function PostGalleryItem({ post }: { post: Post }) {
  const [setIsOpen, setPost] = usePostModalStore((state) => [
    state.setIsOpen,
    state.setPost,
  ])

  return (
    <div
      className="aspect-square cursor-pointer overflow-hidden rounded-lg "
      key={post.id}
      onClick={() => {
        setPost(post)
        setIsOpen(true)
      }}
    >
      {post.postImages[0]?.imageUrl && (
        <div className="relative">
          <Image
            src={post.postImages[0].imageUrl}
            alt={`Image post ${post.id}`}
            width={500}
            height={500}
          />
          {post.postImages.length > 1 && (
            <span className="absolute right-2 top-2 z-10 flex size-6 items-center justify-center rounded-sm bg-gray-950/40 ">
              <GalleryHorizontalEnd className="size-4 text-white" />
            </span>
          )}
        </div>
      )}
    </div>
  )
}
