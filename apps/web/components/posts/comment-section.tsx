import { usePostModalStore } from '@/hooks/use-post-modal-store'
import { Comment } from './comment'
import { CommentForm } from './comment-form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CommentsEmptyState } from './comments-empty-state'
import { useQuery } from '@tanstack/react-query'
import { getComments } from '@/actions/comments'
import { Spinner } from '../ui/spinner'

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
        <Comment
          avatarUrl={post.user.profilePictureUrl}
          username={post.user.username}
          name={post.user.name}
          content={post.description ?? ''}
          date={post.date}
        />
      </header>
      <ScrollArea className="flex h-[0px] w-full flex-1 flex-shrink basis-auto flex-col py-4 pr-3">
        {isFetching && <Spinner color="primary" size={'lg'} />}
        {!isFetching &&
          (hasComments ? (
            data?.data?.map((comment) => (
              <div key={comment.id} className="w-full border-b py-3">
                <Comment
                  avatarUrl={comment.user.profilePictureUrl}
                  username={comment.user.username}
                  name={comment.user.name}
                  content={comment.comment}
                  date={comment.date}
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
