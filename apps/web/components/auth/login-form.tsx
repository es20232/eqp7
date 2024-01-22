'use client'

import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/schemas/auth/login'
import { z } from 'zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { useState } from 'react'
import { FormError } from '../form-error'
import { Spinner } from '../ui/spinner'
import { login } from '@/actions/login'

type FormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: '',
      username: '',
    },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    try {
      const { error } = await login(values)

      setErrorMessage(error)
    } catch (error) {
      setErrorMessage('Ocorreu um erro inesperado')
    }
    setIsLoading(false)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormError message={errorMessage} />
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
        <Button className="w-full" size="lg" disabled={isLoading} type="submit">
          {isLoading && <Spinner size="sm" className="mr-2" />}
          Entrar
        </Button>
      </form>
    </Form>
  )
}
