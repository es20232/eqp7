import { deslike } from '@/actions/deslike'
import { useAction } from '@/hooks/use-action'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { useToast } from '../ui/use-toast'

type DeslikeProps = {
  initialDeslikes: number
  postId: number
}

export function Deslike({ initialDeslikes, postId }: DeslikeProps) {
  const [deslikes, setDeslikes] = useState(initialDeslikes)
  const { toast } = useToast()

  const { execute: executeDeslike } = useAction(deslike, {
    onError: (error) =>
      toast({
        title: 'Erro ao dar deslike',
        description: error,
        variant: 'destructive',
      }),
    onSuccess: () => {
      setDeslikes((prevDeslikes) => prevDeslikes + 1)
    },
  })
  async function handleDeslike() {
    await executeDeslike({ id: postId })
  }
  return (
    <Button variant="outline" onClick={handleDeslike}>
      <ThumbsDown className="h-5 w-5 text-red-500" />
      <span className="ml-2">{deslikes}</span>
    </Button>
  )
}
