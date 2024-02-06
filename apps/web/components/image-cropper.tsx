import { useState, useCallback } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'

type ImageCropperProps = {
  imgSrc: string
  onCropComplete: (croppedAreaPixels: Area) => void
}

export function ImageCropper({ imgSrc, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const handleCropComplete = useCallback(
    async (_: Area, croppedAreaPixels: Area) => {
      onCropComplete(croppedAreaPixels)
    },
    [imgSrc, onCropComplete],
  )

  return (
    <div>
      <Cropper
        image={imgSrc}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onCropComplete={handleCropComplete}
        onZoomChange={setZoom}
      />
    </div>
  )
}
