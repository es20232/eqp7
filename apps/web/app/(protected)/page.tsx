import { PostList } from '@/components/posts/post-list'

export default async function Feed() {
  return (
    <div className="mx-auto flex flex-col items-center px-4 py-6">
      <PostList />
    </div>
  )
}
