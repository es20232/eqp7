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

type FormValues = { name: string; username: string; bio: string; }

type RedefProps = {
  user?: User
}

export function Redef({ user }: RedefProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm<FormValues>({
    defaultValues: {
      name: user?.name,
      username: user?.username,
      bio: user?.bio,
    },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)

    try {

      const resp = await editUser(values)
      setErrorMessage(resp.error)
    } catch (error) {
      console.log(error)
      setErrorMessage('Ocorreu um erro inesperado')
    }
    setIsLoading(false)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
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
        <Button className=" " size="lg" disabled={isLoading} type="submit">
          {isLoading && <Spinner size="sm" className="mr-2" />}
          Redefinir
        </Button>
      </form>
    </Form>
  )
}
