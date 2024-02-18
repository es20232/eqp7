import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { getServerSession } from '@/lib/auth/getServerSession'
import { EditProfile } from '@/components/account/edit-profile'

export default async function Edit() {
  const {
    session: { user },
  } = await getServerSession()
  return (
    <div className="mx-auto flex max-w-2xl flex-col justify-between p-5">
      <header className="mb-4 flex items-center space-x-2 border-b pb-2">
        <Link href="/account">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <h3 className="text-xl font-semibold md:text-2xl">Editar Perfil</h3>
      </header>
      <EditProfile user={user} />
    </div>
  )
}
