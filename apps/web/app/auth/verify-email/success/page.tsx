import {
  AuthHeader,
  AuthHeaderDescription,
  AuthHeaderTitle,
} from '@/components/auth/header'
import { AuthMainContent } from '@/components/auth/main-content'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RegisterSucess() {
  return (
    <>
      <AuthHeader>
        <AuthHeaderTitle>Email verificado!</AuthHeaderTitle>
        <AuthHeaderDescription>
          Sua conta foi criada e verificada com sucesso.
        </AuthHeaderDescription>
      </AuthHeader>
      <AuthMainContent>
        <p>
          Agora você faz parte do VisualSocial. Comece a explorar, compartilhar
          suas fotos e interagir com outros membros da comunidade. Divirta-se!
        </p>
        <Link href="/auth/login" className="mt-6 w-full self-start">
          <Button className="w-full">Acessar minha conta</Button>
        </Link>
      </AuthMainContent>
    </>
  )
}
