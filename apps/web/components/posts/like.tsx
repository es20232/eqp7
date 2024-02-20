import { like } from '@/actions/like'
import { useAction } from '@/hooks/use-action'
import { useState } from 'react'
import { useToast } from '../ui/use-toast'
import { Button } from '../ui/button'
import { ThumbsUp } from 'lucide-react'

type LikeProps = {
  initialLikes: number
  postId: number
  hasLiked: boolean
}

export function Like({
  initialLikes,
  postId,
  hasLiked: initialHasLiked,
}: LikeProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(initialHasLiked)
  const { toast } = useToast()

  const { execute: executeLike } = useAction(like, {
    onError: (error) =>
      toast({
        title: 'Erro ao dar like',
        description: error,
        variant: 'destructive',
      }),
    onSuccess: () => {
      setLikes((prevLikes) => prevLikes + 1)
      setHasLiked(true)
    },
  })
  async function handleLike() {
    await executeLike({ id: postId })
  }
  return (
    <Button
      variant="ghost"
      onClick={handleLike}
      disabled={hasLiked}
      className="group flex-grow"
    >
      <ThumbsUp className="size-4 transition  group-hover:-rotate-12 group-hover:scale-125 group-hover:text-blue-600" />
      <span className="ml-2 transition group-hover:text-blue-600">{likes}</span>
    </Button>
  )
}
