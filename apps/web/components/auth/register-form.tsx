'use client'

import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '../ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { accountSchema } from '@/schemas/auth/account'
import { z } from 'zod'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { useState } from 'react'
import { FormError } from '../form-error'
import { useRouter } from 'next/navigation'

type FormValues = z.infer<typeof accountSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      username: '',
      email: '',
      name: '',
      password: '',
      photo: undefined,
    },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`,
        {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            'Content-type': 'application/json',
          },
        },
      )

      if (response.ok) {
        router.push('/auth/verify-email')
        return
      }
      const error = await response.json()
      setErrorMessage(error.message)
    } catch (error) {
      setErrorMessage('Ocorreu um erro inesperado')
    }
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form className="w-full space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormError message={errorMessage} />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label>Nome</Label>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label>Email</Label>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
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
              <Input {...field} type={showPassword ? 'text' : 'password'} />
              <Button
                className="-translate-x-2"
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setShowPassword((prevState) => !prevState)}
              >
                {showPassword ? 'Esconder' : 'Mostrar'} senha
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" size="lg" disabled={isLoading}>
          {isLoading && <Spinner color="white" size="sm" className="mr-2" />}
          Criar conta
        </Button>
      </form>
    </Form>
  )
}
