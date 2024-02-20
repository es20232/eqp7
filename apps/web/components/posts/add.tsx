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
import { ImagePlus } from 'lucide-react'
import { Textarea } from '../ui/textarea'

type FormValues = {
  descr: string
}
// const descrCharacterCount = Form.watch('descr').length

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
              <Label>
                Descrição
                <span className="text-xs font-normal text-muted-foreground">
                  {/* {descrCharacterCount} / 500 */}
                </span>
              </Label>
              <Textarea
                {...field}
                className="h-20"
                // onChange={(e) => descrCharacterCount < 500 && field.onChange(e)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <div className="flex items-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              <ImagePlus size={24} />
            </label>
            <Input id="file-upload" type="file" className="hidden" />
          </div>
        </FormItem>
        <Button size="lg" disabled={isLoading} type="submit">
          {isLoading && <Spinner size="sm" className="mr-2" />}
          Publicar
        </Button>
      </form>
    </Form>
  )
}
