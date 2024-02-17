import { Post as PostType } from '@/types/post'
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'
import { Button } from '../ui/button'

export function Post(post: PostType) {
  return (
    <div key={post.id} className="rounded-md border p-20 shadow">
      <h2 className="text-2xl font-semibold">Post {post.id}</h2>
      <p className="text-muted-foreground">{post.description}</p>

      {/* Botões para Like, Dislike e Comentário */}
      <div className="mt-4 flex">
        <Button size="icon">
          <ThumbsUp className="h-6 w-6 text-blue-500" />{' '}
        </Button>

        <Button size="icon" className="ml-4">
          <ThumbsDown className="h-6 w-6 text-red-500" />{' '}
        </Button>

        <Button size="icon" className="ml-4">
          <MessageSquare className="h-6 w-6 text-green-500" />
        </Button>
      </div>
    </div>
  )
}
