import { usePostModalStore } from '@/hooks/use-post-modal-store'
import { Comment } from './comment'
import { CommentForm } from './comment-form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CommentsEmptyState } from './comments-empty-state'
import { useQuery } from '@tanstack/react-query'
import { getComments } from '@/actions/comments'
import { Spinner } from '../ui/spinner'
import { getInitials } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export function CommentSection() {
  const [post, isOpen] = usePostModalStore((state) => [
    state.post,
    state.isOpen,
  ])

  const { data, isFetching } = useQuery({
    queryKey: [post.id, 'comments'],
    queryFn: () => getComments({ postId: post.id }),
    enabled: isOpen,
  })

  if (!isOpen || !post) return null

  const hasComments = data?.data?.length && data.data.length > 0

  return (
    <section className="flex h-full w-full  flex-col">
      <header className=" border-b pb-3">
        <div className="flex w-full space-x-4">
          <span>
            <Avatar className="size-10">
              {post.user.profilePictureUrl && (
                <AvatarImage src={post.user.profilePictureUrl} />
              )}
              <AvatarFallback>{getInitials(post.user.name)}</AvatarFallback>
            </Avatar>
          </span>
          <div>
            <span className="text-xs font-medium">
              {post.user.username}
              <span className="ml-2 text-muted-foreground">{post.date}</span>
            </span>
            <p className="text-sm">{post.description}</p>
          </div>
        </div>
      </header>
      <ScrollArea className="flex h-[0px] w-full flex-1 flex-shrink basis-auto flex-col py-4 pr-3">
        {isFetching && <Spinner color="primary" size={'lg'} />}
        {!isFetching &&
          (hasComments ? (
            data?.data?.map((comment) => (
              <div key={comment.id} className="w-full border-b py-3">
                <Comment
                  comment={comment}
                  ownerId={post.user.id}
                  postId={post.id}
                />
              </div>
            ))
          ) : (
            <CommentsEmptyState />
          ))}
      </ScrollArea>
      <footer className="border-t pt-3">
        <CommentForm />
      </footer>
    </section>
  )
}
