import { getInitials } from '@/lib/utils'
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'

type CommentProps = {
  avatarUrl: string
  username: string
  content: string
  name: string
  date: string
}

export function Comment({
  avatarUrl,
  content,
  username,
  name,
  date,
}: CommentProps) {
  return (
    <div className="flex space-x-4">
      <span>
        <Avatar className="size-10">
          {avatarUrl && <AvatarImage src={avatarUrl} />}
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
      </span>
      <div>
        <span className="text-xs font-medium">
          {username} <span className="ml-2 text-muted-foreground">{date}</span>
        </span>
        <p className="text-sm">{content}</p>
      </div>
    </div>
  )
}
