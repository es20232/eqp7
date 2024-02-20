import { Trash } from 'lucide-react'
import { Button } from '../ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog'
import { deleteComment } from '@/actions/comments'
import { useAction } from '@/hooks/use-action'
import { useToast } from '../ui/use-toast'
import { Spinner } from '../ui/spinner'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

type DeleteCommentProps = {
  id: number
  postId: number
}

export function DeleteComment({ id, postId }: DeleteCommentProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const { execute, isLoading } = useAction(deleteComment, {
    onError: (error) =>
      toast({
        title: 'Erro',
        description: error,
        variant: 'destructive',
      }),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [postId, 'comments'] })
      toast({
        title: 'Comentário excluido',
        description: data,
      })
    },
    onComplete: () => setOpen(false),
  })

  async function handleDeleteComment() {
    try {
      await execute({ id, postId })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado',
        variant: 'destructive',
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir comentário</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Tem certeza que deseja excluir o comentário?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancelar</Button>
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={handleDeleteComment}
          >
            {isLoading && <Spinner size="sm" className="mr-2" />}
            Sim, excluir
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
