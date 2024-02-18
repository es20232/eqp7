import { PostList } from '@/components/posts/post-list'

export default async function Feed() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <PostList />
    </div>
  )
}
