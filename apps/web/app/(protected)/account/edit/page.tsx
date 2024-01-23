import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Redef } from '@/components/account/edit'

export default function Edit() {
  return (
    <div>
      <div className="mx-auto flex max-w-2xl justify-between py-5">
        <Link href="/account">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-md bg-blue-200 p-6 shadow-md">
        <h3 className="mb-4 text-2xl font-bold">Editar Perfil</h3>
        <Redef />
      </div>
    </div>
  )
}
