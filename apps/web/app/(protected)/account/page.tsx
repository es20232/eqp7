import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/hooks/useUser'
import { Pen } from 'lucide-react'
import { ProfileMoreActions } from '@/components/account/profile-more-actions'

export default function Account() {
  const user = useUser()
  return (
    <div>
      <div className="m h-[30vh] w-full bg-gray-100" />
      <div className="mx-auto flex max-w-7xl justify-between px-4 py-5 sm:flex-row sm:gap-6 sm:px-0">
        <div className="flex gap-6">
          <Image
            src={user?.profilePicture ?? '/avatar.jpg'}
            alt="Foto de perfil"
            className="ring-white w-48 aspect-square -translate-y-1/2 rounded-full object-cover ring-4 bg-white"
            width={180}
            height={180}
          />
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-medium">{user?.name}</h2>
            <p className='max-w-md'>{user?.bio}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/account/edit">
            <Button variant="outline">
              <Pen className='h-4 w-4 mr-2' />
              Editar</Button>
          </Link>
          <ProfileMoreActions />
        </div>
      </div>
    </div>
  )
}
