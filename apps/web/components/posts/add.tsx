'use client'

import { useRef, useState } from 'react'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { FormError } from '../form-error'
import { Spinner } from '../ui/spinner'
import { editUser } from '@/actions/user'
import { useAction } from '@/hooks/use-action'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/use-toast'

type FormValues = {
  descr: string
}

export function Add() {
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef(null)

  const { execute, isLoading } = useAction(editUser, {
    onError: (error) => setErrorMessage(error),
    onSuccess: (data) => {
      toast({
        title: 'Publicação realizada',
        description: data,
      })
      router.replace('/account')
    },
  })

  const form = useForm<FormValues>()

  async function onSubmit({ descr }: FormValues) {
    try {
      const formData = new FormData()
      formData.append('descr', descr)

      // // Adiciona a foto ao formData
      // if (fileInputRef.current.files.length > 0) {
      //   formData.append('photo', fileInputRef.current.files[0])
      // }

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
          name="descr"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label>Descrição</Label>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <Label>Foto</Label>
          <input type="file" ref={fileInputRef} />
        </FormItem>
        <Button size="lg" disabled={isLoading} type="submit">
          {isLoading && <Spinner size="sm" className="mr-2" />}
          Publicar
        </Button>
      </form>
    </Form>
  )
}
