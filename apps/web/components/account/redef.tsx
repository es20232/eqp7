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
import { useAction } from '@/hooks/use-action'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/use-toast'
import { User } from '@/types/auth'

type FormValues = {
  name: string
  username: string
  bio: string
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
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      await execute(values)
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
