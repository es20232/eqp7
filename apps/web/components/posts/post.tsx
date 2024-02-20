import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { Post as PostType } from '@/types/post'
import { MessageCircleMore } from 'lucide-react'
import { Button } from '../ui/button'
import { Like } from './like'
import { Deslike } from './deslike'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import {
  Carousel,
  CarouselPreviousRelative,
  CarouselNextRelative,
  CarouselContent,
  CarouselItem,
} from '../ui/carousel'
import Image from 'next/image'
import { usePostModalStore } from '@/hooks/use-post-modal-store'

export function Post(post: PostType) {
  const [setIsOpen, setPost] = usePostModalStore((state) => [
    state.setIsOpen,
    state.setPost,
  ])

  function handleOpenPost() {
    setPost(post)
    setIsOpen(true)
  }
  return (
    <div key={post.id}>
      <div>
        <Carousel className="aspect-[9/16] max-h-[70vh] ">
          <header className="mb-2 flex justify-between space-x-2 rounded-md">
            <div className="flex items-center gap-2">
              {post.user?.profilePictureUrl ? (
                <Avatar>
                  <AvatarImage src={post.user?.profilePictureUrl} />
                  <AvatarFallback>{getInitials(post.user.name)}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarFallback>{getInitials(post.user.name)}</AvatarFallback>
                </Avatar>
              )}
              <span className="text-sm font-medium">{post.user.username}</span>
            </div>
            <div className="space-x-2">
              <CarouselPreviousRelative />
              <CarouselNextRelative />
            </div>
          </header>
          <CarouselContent>
            {post.postImages.map((image) => (
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
      </div>

      <div className="mt-2 flex justify-center space-x-2 border-b border-t py-1">
        <Like
          initialLikes={post.totalLikes}
          postId={post.id}
          hasLiked={post.hasUserLiked}
        />
        <Deslike
          initialDeslikes={post.totalDeslikes}
          postId={post.id}
          hasDesliked={post.hasUserDesliked}
        />
      </div>
      <p className="mt-2 text-sm">
        <span className="mr-2 text-xs font-medium text-muted-foreground">
          Descrição
        </span>
        {post.description}
      </p>
      <Button
        variant="link"
        onClick={handleOpenPost}
        size="sm"
        className="-translate-x-3"
      >
        Ver todos os {post.totalComments} comentários
      </Button>
    </div>
  )
}
