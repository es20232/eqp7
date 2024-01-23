import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Redef } from '@/components/account/edit'
import { ArrowLeft } from 'lucide-react'

export default function Edit() {
  return (
    <div className="mx-auto flex max-w-2xl justify-between py-5 flex-col">
      <Link href="/account" className='mb-8'>
        <Button variant="ghost" className='-translate-x-3'><ArrowLeft className='h-4 w-4 mr-2' />Voltar</Button>
      </Link>

      <h3 className="mb-4 text-2xl font-bold">Editar Perfil</h3>
      <Redef />
    </div>
  )
}
