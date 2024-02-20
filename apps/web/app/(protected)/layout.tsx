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
        <header className="sticky top-0 z-10 border-b bg-white/70 px-4 py-3 backdrop-blur-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
            <Link href="/">
              <Image src={Logo} alt="VisualSocial logo" className="size-10" />
            </Link>

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
