import { Post as PostType } from '@/types/post'
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import Link from 'next/link'

export function Post(post: PostType) {
  return (
    <div key={post.id} className="rounded-md border p-20 shadow">
      <div className="flex items-center gap-4">
        <Link href="/account" passHref>
          <div className="flex cursor-pointer items-center gap-2">
            {post.user?.profilePictureUrl ? (
              <Avatar>
                <AvatarImage src={post.user?.profilePictureUrl} />
                <AvatarFallback>{getInitials(post.user.name)}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar>
                <AvatarFallback>{getInitials(post.user.name)}</AvatarFallback>
              </Avatar>
            )}
            <span className="text-sm font-medium">{post.user.username}</span>
          </div>
        </Link>
      </div>

      <h2 className="text-2xl font-semibold">Post {post.id}</h2>
      <p className="text-muted-foreground">{post.description}</p>

      <div className="mt-4 flex">
        <Button variant="outline">
          <ThumbsUp className="h-6 w-6 text-blue-500" />
        </Button>

        <Button variant="outline" className="ml-4">
          <ThumbsDown className="h-6 w-6 text-red-500" />
        </Button>

        <Button variant="outline" className="ml-4">
          <MessageSquare className="h-6 w-6 text-green-500" />
        </Button>
      </div>
    </div>
  )
}
