import { Post } from '@/types/post'
import { PostGalleryItem } from './post-gallery-item'

type PostGalleryProps = {
  posts: Post[]
}

export function PostGallery({ posts }: PostGalleryProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(175px,1fr))]  lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
      {posts.map((post) => (
        <PostGalleryItem key={post.id} post={post} />
      ))}
    </div>
  )
}
