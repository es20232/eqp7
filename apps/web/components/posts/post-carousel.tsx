import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNextRelative,
  CarouselPreviousRelative,
} from '../ui/carousel'

import Image from 'next/image'

type PostImage = {
  id: number
  image: string
  imageUrl: string
}

type PostCarouselProps = {
  postImages: PostImage[]
}

export function PostCarousel({ postImages }: PostCarouselProps) {
  return (
    <Carousel className="relative aspect-[9/16] h-[90svh]">
      <header className="absolute right-2 top-2 z-[10000] mb-2 space-x-2 rounded-md bg-white/40 p-2 shadow backdrop-blur">
        <CarouselPreviousRelative />
        <CarouselNextRelative />
      </header>
      <CarouselContent>
        {postImages.map((image) => (
          <CarouselItem key={image.id}>
            <AspectRatio ratio={9 / 16}>
              <div className="flex h-full w-full items-center rounded-md bg-neutral-950">
                <Image
                  src={image.imageUrl}
                  alt={`Imagem ${image.id}`}
                  width={1080}
                  height={1920}
                  className="my-auto"
                />
              </div>
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
