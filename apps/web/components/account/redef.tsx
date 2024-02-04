'use client'

import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { useState } from 'react'
import { FormError } from '../form-error'
import { Spinner } from '../ui/spinner'
import { editUser } from '@/actions/user'
import { User } from '@/hooks/useUser'
import { useAction } from '@/hooks/useAction'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/use-toast'

type FormValues = {
  name: string
  username: string
  bio: string
  profilePicture?: File
}

type RedefProps = {
  user?: User
}

export function Redef({ user }: RedefProps) {
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
      profilePicture: undefined,
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      const formData = new FormData()

      formData.append('name', values.name)
      formData.append('username', values.username)
      formData.append('bio', values.bio)
      formData.append('profilePicture', values.profilePicture)

      await execute(formData)
    } catch (error) {
      setErrorMessage('Ocorreu um erro inesperado')
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormError message={errorMessage} />
        <FormField
          name="profilePicture"
          control={form.control}
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <Label>Nome</Label>
              <Input
                {...field}
                value={value?.fileName}
                onChange={(event) => {
                  onChange(event.target.files[0])
                }}
                type="file"
              />
              <FormMessage />
            </FormItem>
          )}
        />
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
              <Label>Biografia</Label>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size="lg" disabled={isLoading} type="submit">
          {isLoading && <Spinner size="sm" className="mr-2" />}
          Redefinir
        </Button>
      </form>
    </Form>
  )
}
