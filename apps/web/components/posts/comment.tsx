import { getInitials } from '@/lib/utils'
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import useSession from '@/lib/auth/useSession'
import { Comment } from '@/types/post'
import { DeleteComment } from './delete-comment'

type CommentProps = {
  comment: Comment
  ownerId: number
  postId: number
}

export function Comment({
  comment: { comment, date, user, id },
  ownerId,
  postId,
}: CommentProps) {
  const { user: currentUser } = useSession()

  const isOwner = currentUser?.id === ownerId

  return (
    <div className="flex w-full space-x-4">
      <span>
        <Avatar className="size-10">
          {user.profilePictureUrl && (
            <AvatarImage src={user.profilePictureUrl} />
          )}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </span>
      <div className="flex w-full items-center">
        <div className="w-full">
          <span className="text-xs font-medium">
            {user.username}
            <span className="ml-2 text-muted-foreground">{date}</span>
          </span>
          <p className="text-sm">{comment}</p>
        </div>
        {isOwner && <DeleteComment id={id} postId={postId} />}
      </div>
    </div>
  )
}
