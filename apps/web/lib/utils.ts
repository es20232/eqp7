import { type ClassValue, clsx } from 'clsx'
import image from 'next/image'
import { Area, Area } from 'react-easy-crop'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name = 'User'): string {
  return name
    .match(/(\b\S)?/g)
    .join('')
    .match(/(^\S|\S$)?/g)
    .join('')
}

export async function getCroppedImg(
  imgSrc: string,
  pixelCrop: Area,
): Promise<File | null> {
  const image = new Image()
  image.src = imgSrc
  image.setAttribute('crossOrigin', 'anonymous')

  await image.decode()

  const croppedCanvas = document.createElement('canvas')
  const croppedCtx = croppedCanvas.getContext('2d')

  if (!croppedCtx) {
    return null
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width
  croppedCanvas.height = pixelCrop.height

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(async (blob) => {
      const file = new File([blob], 'profile.jpg', { type: 'image/jpg' })
      resolve(file)
    }, 'image/jpeg')
  })
}
