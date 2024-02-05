import {
  AuthHeader,
  AuthHeaderDescription,
  AuthHeaderTitle,
} from '@/components/auth/header'
import { LoginForm } from '@/components/auth/login-form'
import { AuthMainContent } from '@/components/auth/main-content'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type LoginProps = {
  searchParams: {
    callbackUrl?: string
  }
}

export default async function Login({
  searchParams: { callbackUrl },
}: LoginProps) {
  return (
    <div>
      <AuthHeader>
        <AuthHeaderTitle>Entre no VisualSocial</AuthHeaderTitle>
        <AuthHeaderDescription>
          Entre na nossa comunidade e comece a compartilhar suas imagens
          favoritas com o mundo.
        </AuthHeaderDescription>
      </AuthHeader>
      <AuthMainContent>
        <LoginForm callbackUrl={callbackUrl} />
        <div className="mt-6 flex w-full items-center justify-center">
          <Link href="/auth/forgot-password">
            <Button variant="link" className="">
              Esqueceu a senha?
            </Button>
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/auth/register">
            <Button variant="link" className="">
              Não tem uma conta?
            </Button>
          </Link>
        </div>
      </AuthMainContent>
    </div>
  )
}
