import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Pen } from 'lucide-react'
import { ProfileMoreActions } from '@/components/account/profile-more-actions'
import { getServerSession } from '@/lib/auth/getServerSession'
import { ProfilePicture } from './_components/profile-picture'

export default async function Account() {
  const {
    session: { user },
  } = await getServerSession()
  return (
    <div>
      <div className="h-[30vh] w-full bg-gray-100" />
      <div className="mx-auto max-w-7xl  p-5 sm:flex-row sm:gap-6">
        <div className="relative flex  justify-end">
          <ProfilePicture />
          <div className="flex gap-2">
            <Link href="/account/edit">
              <Button variant="outline">
                <Pen className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </Link>
            <ProfileMoreActions />
          </div>
        </div>
        <div className="mt-5 flex flex-col space-y-2">
          <div className="flex flex-col flex-wrap gap-x-2 sm:flex-row sm:items-center">
            <h2 className="text-xl font-semibold md:text-2xl">{user?.name}</h2>
            <span className="text-sm text-muted-foreground">
              @{user?.username}
            </span>
          </div>
          <p className="max-w-md">{user?.bio}</p>
        </div>
      </div>
    </div>
  )
}
