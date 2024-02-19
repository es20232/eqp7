import { like } from '@/actions/like'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAction } from '@/hooks/use-action'
import { getInitials } from '@/lib/utils'
import { Post as PostType } from '@/types/post'
import { MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { useToast } from '../ui/use-toast'

export function Post(post: PostType) {
  const [likes, setLikes] = useState(post.totalLikes)
  const { toast } = useToast()

  const { execute } = useAction(like, {
    onError: (error) =>
      toast({
        title: 'Erro ao dar like',
        description: error,
        variant: "destructive",
      }),
    onSuccess: () => {
      setLikes((prevLikes) => prevLikes + 1)
    },
  })
  async function handleLike() {
    await execute({ id: post.id })
  }
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
        <Button variant="outline" onClick={handleLike}>
          <ThumbsUp className="h-5 w-5 text-blue-500" />
          <span className="ml-2">{likes}</span>
        </Button>

        <Button variant="outline" className="ml-4">
          <ThumbsDown className="h-5 w-5 text-red-500" />
          <span className="ml-2">{post.totalDeslikes}</span>
        </Button>

        <Button variant="outline" className="ml-4">
          <MessageSquare className="h-5 w-5 text-green-500" />
          <span className="ml-2">{post.totalComments}</span>
        </Button>
      </div>
    </div>
  )
}
