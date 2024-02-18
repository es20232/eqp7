import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ReceiptText } from 'lucide-react'
import { ProfileMoreActions } from '@/components/account/profile-more-actions'
import { getServerSession } from '@/lib/auth/getServerSession'
import { ProfilePicture } from '../../../components/account/profile-picture'

export default async function Account() {
  const {
    session: { user },
  } = await getServerSession()

  return (
    <div className="mx-auto my-8 max-w-7xl px-4">
      <div className="relative grid grid-cols-[min-content_1fr_min-content] grid-rows-[min-content_min-content] justify-between">
        <ProfilePicture />
        <div className="col-span-3 row-start-2 mt-6 flex w-full flex-col lg:col-start-2 lg:row-start-1 lg:ml-8 lg:mt-0">
          <h2 className="text-xl font-semibold md:text-2xl">{user?.name}</h2>
          <span className="text-sm text-muted-foreground">
            @{user?.username}
          </span>
          <p className="mt-4 max-w-[75ch] overflow-hidden text-ellipsis text-sm md:text-base lg:max-w-md">
            {user?.bio}
          </p>
        </div>
        <div className="col-start-3 row-start-1 flex space-x-2">
          <Link href="/account/post">
            <Button variant="outline">
              <ReceiptText className="mr-2 h-6 w-5" />
              Publicação
            </Button>
          </Link>
          <ProfileMoreActions />
        </div>
      </div>
    </div>
  )
}
