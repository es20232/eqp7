'use client'

import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/schemas/auth/login'
import { z } from 'zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'

type FormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: '',
      username: '',
    },
  })

  function onSubmit(values: FormValues) {
    console.log(values)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
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
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label>Senha</Label>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" size="lg">
          Entrar
        </Button>
      </form>
    </Form>
  )
}
