'use client'

import { useState } from 'react'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { FormError } from '../form-error'
import { Spinner } from '../ui/spinner'
import { useAction } from '@/hooks/use-action'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/use-toast'
import { Textarea } from '../ui/textarea'
import { postSchema } from '@/schemas/post'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createPost } from '@/actions/create-post'

type FormValues = z.infer<typeof postSchema>

export function CreatePost() {
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const { execute, isLoading } = useAction(createPost, {
    onError: (error) => setErrorMessage(error),
    onSuccess: (data) => {
      toast({
        title: 'Publicação realizada',
        description: data,
      })
      router.replace('/account')
    },
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      description: '',
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      const formData = new FormData()
      const images = Array.from(values.images)

      formData.append('description', values.description)
      images.forEach((image) => {
        formData.append('images', image as File)
      })

      await execute(formData)
    } catch (error) {
      console.log(error)
      setErrorMessage('Ocorreu um erro inesperado')
    }
  }

  const descriptionCharacterCount = form.watch('description').length

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormError message={errorMessage} />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label className="flex justify-between">
                Descrição
                <span className="text-xs font-normal text-muted-foreground">
                  {descriptionCharacterCount} / 2000
                </span>
              </Label>
              <Textarea
                {...field}
                onChange={(e) =>
                  descriptionCharacterCount < 2000 && field.onChange(e)
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="images"
          control={form.control}
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <Label>Imagens</Label>
              <Input
                {...field}
                value={value && value?.fileName}
                onChange={(event) => {
                  onChange(event.target.files)
                }}
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/bmp, image/webp"
                multiple
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size="lg" disabled={isLoading} type="submit">
          {isLoading && <Spinner size="sm" className="mr-2" />}
          Publicar
        </Button>
      </form>
    </Form>
  )
}
