import { like } from '@/actions/like'
import { useAction } from '@/hooks/use-action'
import { useState } from 'react'
import { useToast } from '../ui/use-toast'
import { Button } from '../ui/button'
import { ThumbsUp } from 'lucide-react'

type LikeProps = {
  initialLikes: number
  postId: number
}

export function Like({ initialLikes, postId }: LikeProps) {
  const [likes, setLikes] = useState(initialLikes)
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
    },
  })
  async function handleLike() {
    await executeLike({ id: postId })
  }
  return (
    <Button variant="outline" onClick={handleLike}>
      <ThumbsUp className="h-5 w-5 text-blue-500" />
      <span className="ml-2">{likes}</span>
    </Button>
  )
}
