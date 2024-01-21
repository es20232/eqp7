import {
  AuthHeader,
  AuthHeaderDescription,
  AuthHeaderTitle,
} from '@/components/auth/header'
import { AuthMainContent } from '@/components/auth/main-content'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmail() {
  return (
    <>
      <AuthHeader>
        <AuthHeaderTitle>Verifique seu email!</AuthHeaderTitle>
        <AuthHeaderDescription>
          Quase lá! Você está a um passo de concluir o cadastro.
        </AuthHeaderDescription>
      </AuthHeader>

      <AuthMainContent>
        <p className="">
          Enviamos um link de verificação para o seu email. Acesse o seu email e
          clique no link para confirmar a sua conta. Caso não encontre o email,
          verifique a sua pasta de spam.
        </p>
        <Link href="/auth/login" className="mt-6 self-start">
          <Button className="-translate-x-4" variant="link">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ir para login
          </Button>
        </Link>
      </AuthMainContent>
    </>
  )
}
