import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getInitials } from '@/lib/utils'
import { getServerSession } from '@/lib/auth/getServerSession'
import Logo from '@/public/logo.svg'
import { PostModal } from '@/components/posts/post-modal'
import { UserAvatar } from '@/components/user-avatar'
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    session: { user },
  } = await getServerSession()
  return (
    <>
      <div className="min-h-[100svh] w-full ">
        <header className=" border-b px-4 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
            <Link href="/">
              <Image src={Logo} alt="VisualSocial logo" className="size-10" />
            </Link>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pesquisar" className="pl-8" />
            </div>
            <Link href="/account">
              <UserAvatar
                avatarUrl={user?.profilePictureUrl}
                name={user?.name}
                username={user?.username}
              />
            </Link>
          </div>
        </header>
        <main>{children}</main>
      </div>
      <PostModal />
    </>
  )
}
