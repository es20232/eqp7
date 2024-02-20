import { deslike } from '@/actions/deslike'
import { useAction } from '@/hooks/use-action'
import { ThumbsDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { useToast } from '../ui/use-toast'

type DeslikeProps = {
  initialDeslikes: number
  postId: number
  hasDesliked: boolean
}

export function Deslike({
  initialDeslikes,
  postId,
  hasDesliked: initialHasDesliked,
}: DeslikeProps) {
  const [deslikes, setDeslikes] = useState(initialDeslikes)
  const [hasDesliked, setHasDesliked] = useState(initialHasDesliked)
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
      setHasDesliked(true)
    },
  })
  async function handleDeslike() {
    await executeDeslike({ id: postId })
  }
  return (
    <Button
      variant="ghost"
      onClick={handleDeslike}
      disabled={hasDesliked}
      className="group flex-grow hover:bg-red-50"
    >
      <ThumbsDown className="size-4 transition  group-hover:-rotate-12 group-hover:scale-125 group-hover:text-destructive" />
      <span className="ml-2 transition group-hover:text-destructive">
        {deslikes}
      </span>
    </Button>
  )
}
