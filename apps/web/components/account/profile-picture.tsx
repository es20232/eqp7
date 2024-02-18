'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import useSession from '@/lib/auth/useSession'
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Camera, ImagePlus } from 'lucide-react'
import NextImage from 'next/image'
import { useEffect, useState } from 'react'

import 'react-image-crop/dist/ReactCrop.css'
import { getCroppedImg } from '@/lib/utils'
import { editUser } from '@/actions/user'
import { useAction } from '@/hooks/use-action'
import { Area } from 'react-easy-crop'
import { useToast } from '@/components/ui/use-toast'
import { Spinner } from '@/components/ui/spinner'
import { ImageCropper } from '@/components/image-cropper'
import { useFilePreview } from '@/hooks/use-file-preview'
import { FormError } from '@/components/form-error'

export function ProfilePicture() {
  const { user } = useSession()
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [file, onChange, setFile] = useFilePreview(
    user?.profilePictureUrl ?? '/avatar.jpg',
  )

  const { toast } = useToast()

  const { execute, isLoading } = useAction(editUser, {
    onError: (error) => setErrorMessage(error),
    onSuccess: (data) => {
      toast({
        title: 'Dados atualizados',
        description: data,
      })
      setOpen(false)
    },
  })

  useEffect(() => {
    setFile(user?.profilePictureUrl ?? '/avatar.jpg')
  }, [user])

  async function onSubmit() {
    const croppedImage = await getCroppedImg(file, croppedAreaPixels)

    const formData = new FormData()
    formData.append('profilePicture', croppedImage)

    await execute(formData)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="group relative flex size-24 items-center justify-center overflow-hidden  rounded-full bg-gray-950  md:size-32">
          <NextImage
            src={user?.profilePictureUrl ?? '/avatar.jpg'}
            alt="Foto de perfil"
            className="aspect-square h-full w-full"
            width={180}
            height={180}
            unoptimized={true}
          />
          <span className="absolute flex h-full w-full items-center justify-center rounded-full bg-primary/40 opacity-0 transition group-hover:opacity-100">
            <Camera className="size-8 text-white drop-shadow-2xl transition-all" />
          </span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar foto de perfil</DialogTitle>
        </DialogHeader>
        <FormError message={errorMessage} />
        <div className="relative h-[400px] overflow-hidden rounded-lg">
          <ImageCropper imgSrc={file} onCropComplete={setCroppedAreaPixels} />
        </div>
        <DialogFooter>
          <div className="flex w-full justify-between space-x-2">
            <TooltipProvider>
              <Tooltip delayDuration={50}>
                <TooltipTrigger>
                  <input
                    onChange={onChange}
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/bmp, image/webp"
                    id="upload"
                    className="hidden"
                  />
                  <Button variant="outline" size="icon" asChild>
                    <label htmlFor="upload">
                      <ImagePlus className="size-4" />
                    </label>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enviar nova imagem</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="space-x-2">
              <DialogClose asChild>
                <Button variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button onClick={onSubmit} disabled={isLoading}>
                {isLoading && <Spinner size="sm" className="mr-2" />}
                Salvar
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
