'use client'

import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem } from '../ui/form'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { SendHorizontal } from 'lucide-react'
import { addComment } from '@/actions/comments'
import { useAction } from '@/hooks/use-action'
import { useToast } from '../ui/use-toast'
import { usePostModalStore } from '@/hooks/use-post-modal-store'
import { Spinner } from '../ui/spinner'
import { useQueryClient } from '@tanstack/react-query'

type FormValues = {
  content: string
}

export function CommentForm() {
  const post = usePostModalStore((state) => state.post)
  const form = useForm<FormValues>({
    defaultValues: {
      content: '',
    },
  })
  const queryClient = useQueryClient()

  const { toast } = useToast()

  const { execute, isLoading } = useAction(addComment, {
    onError: (error) => {
      toast({
        title: 'Erro',
        description: error,
        variant: 'destructive',
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [post?.id, 'comments'] })
      toast({
        title: 'Comentário adicionado',
        description: data,
      })
    },
  })

  async function onSubmit({ content }: FormValues) {
    try {
      await execute({
        postId: post.id,
        comment: content,
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado',
        variant: 'destructive',
      })
    }
  }

  const isCommentEmpty = form.watch('content')?.length === 0

  return (
    <Form {...form}>
      <form
        className="flex items-center space-x-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-grow">
              <Textarea {...field} placeholder="Adicione um comentário" />
            </FormItem>
          )}
        />
        <Button size="icon" disabled={isCommentEmpty || isLoading}>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <SendHorizontal className="size-4" />
          )}
        </Button>
      </form>
    </Form>
  )
}
