import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/hooks/useUser'

export default function Account() {
  const user = useUser()
  return (
    <div>
      <div className="m h-[30vh] w-full bg-blue-100" />
      <div className="mx-auto flex max-w-7xl justify-between px-4 py-5 sm:flex-row sm:gap-6 sm:px-0">
        <div className="flex gap-6">
          <Image
            src="/test.jpg"
            alt="Foto de perfil"
            className="ring-whinte aspect-square -translate-y-1/2 rounded-full object-cover ring-4"
            width={180}
            height={180}
          />
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-medium">{user?.name}</h2>
            <div className="flex gap-10">
              <div className="flex flex-col items-center justify-center">
                <span className="text-sn uppercasa text-muted-foreground">
                  Seguidores
                </span>
                <span className="text-sn uppercasa text-muted-foreground">
                  123
                </span>
              </div>
              <Separator orientation="vertical" />
              <div className="flex flex-col items-center justify-center">
                <span className="text-sn uppercasa text-muted-foreground">
                  Galeria
                </span>
                <span className="text-sn uppercasa text-muted-foreground">
                  321
                </span>
              </div>
              <Separator orientation="vertical" />
            </div>
            <Link href="/account/biografia">
              <Button className="bg-blue-500">Ver Biografia</Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/account/edit">
            <Button variant="outline">Editar Perfil</Button>
          </Link>
          <Link href="/account/configs">
            <Button variant="outline">Configurações</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
