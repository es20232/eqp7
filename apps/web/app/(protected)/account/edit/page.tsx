import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Redef } from '@/components/account/redef'
import { ArrowLeft } from 'lucide-react'
import { getServerSession } from '@/lib/auth/getServerSession'

export default async function Edit() {
  const {
    session: { user },
  } = await getServerSession()
  return (
    <div className="mx-auto flex max-w-2xl flex-col justify-between py-5">
      <Link href="/account" className="mb-8">
        <Button variant="ghost" className="-translate-x-3">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </Link>

      <h3 className="mb-4 text-2xl font-bold">Editar Perfil</h3>
      <Redef user={user} />
    </div>
  )
}
