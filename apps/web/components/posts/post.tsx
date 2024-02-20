import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { Post as PostType } from '@/types/post'
import { MessageSquare } from 'lucide-react'
import { Button } from '../ui/button'
import { Like } from './like'
import { Deslike } from './deslike'

export function Post(post: PostType) {
  return (
    <div key={post.id} className="rounded-md border p-20 shadow">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
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
      </div>

      <h2 className="text-2xl font-semibold">Post {post.id}</h2>
      <p className="text-muted-foreground">{post.description}</p>

      <div className="mt-4 flex">
        <Like initialLikes={post.totalLikes} postId={post.id} />
        <Deslike initialDeslikes={post.totalDeslikes} postId={post.id} />
        <Button variant="outline" className="ml-4">
          <MessageSquare className="h-5 w-5 text-green-500" />
          <span className="ml-2">{post.totalComments}</span>
        </Button>
      </div>
    </div>
  )
}
