import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'

import { Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '../../hooks/useUser'
import { getInitials } from '@/lib/utils'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useUser()
  return (
    <div className="min-h-[100svh] w-full ">
      <header className=" border-b px-4 py-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Image
            src="/logo.png"
            width={32}
            height={32}
            alt="VisualSocial logo"
            quality={100}
          />
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar" className="pl-8" />
          </div>
          <Link href="/account">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:block">
                {user?.username}
              </span>
            </div>
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
