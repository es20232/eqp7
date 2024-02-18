'use client'

import { editUser } from '@/actions/user'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useAction } from '@/hooks/use-action'
import { User } from '@/types/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormError } from '../form-error'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Spinner } from '../ui/spinner'
import { useToast } from '../ui/use-toast'
import { Textarea } from '../ui/textarea'

type FormValues = {
  name: string
  username: string
  bio: string
}

type EditProfileProps = {
  user?: User
}

export function EditProfile({ user }: EditProfileProps) {
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const { execute, isLoading } = useAction(editUser, {
    onError: (error) => setErrorMessage(error),
    onSuccess: (data) => {
      toast({
        title: 'Dados atualizados',
        description: data,
      })
      router.replace('/account')
    },
  })

  const form = useForm<FormValues>({
    defaultValues: {
      name: user?.name,
      username: user?.username,
      bio: user?.bio ?? '',
    },
  })

  const bioCharacterCount = form.watch('bio').length

  async function onSubmit(values: FormValues) {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('username', values.username)
      formData.append('bio', values.bio)
      await execute(formData)
    } catch (error) {
      setErrorMessage('Ocorreu um erro inesperado')
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormError message={errorMessage} />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label>Nome</Label>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label>Usuário</Label>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="bio"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label className="flex justify-between">
                Biografia
                <span className="text-xs font-normal text-muted-foreground">
                  {bioCharacterCount} / 200
                </span>
              </Label>
              <Textarea
                {...field}
                maxLength={200}
                onChange={(e) => bioCharacterCount < 200 && field.onChange(e)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit" className="w-full md:w-auto">
          {isLoading && <Spinner size="sm" className="mr-2" />}
          Salvar
        </Button>
      </form>
    </Form>
  )
}
