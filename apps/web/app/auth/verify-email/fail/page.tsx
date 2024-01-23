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
        <AuthHeaderTitle>Email não verificado!</AuthHeaderTitle>
        <AuthHeaderDescription>
          Não foi possível verificar seu email.
        </AuthHeaderDescription>
      </AuthHeader>

      <AuthMainContent>
        <p className="">
          Não conseguimos validar seu email. Por favor, volte para a página de login e tente novamente em alguns instantes.
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
