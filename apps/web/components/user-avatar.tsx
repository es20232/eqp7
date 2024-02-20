import { getInitials } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

type UserAvatarProps = {
  avatarUrl?: string
  username?: string
  name?: string
}

export function UserAvatar({ avatarUrl, username, name }: UserAvatarProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-10">
        {avatarUrl && <AvatarImage src={avatarUrl} />}
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <span className=" md:block">{username}</span>
    </div>
  )
}
