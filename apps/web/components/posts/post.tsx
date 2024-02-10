import { Post } from '@/types/post'

export function Post(post: Post) {
  return (
    <div key={post.id} className="rounded-md border p-20 shadow">
      <h2 className="text-2xl font-semibold">Post {post.id}</h2>
      <p className="text-muted-foreground">{post.description}</p>
    </div>
  )
}
