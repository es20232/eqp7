import {
  AuthHeader,
  AuthHeaderDescription,
  AuthHeaderTitle,
} from '@/components/auth/header'
import { AuthMainContent } from '@/components/auth/main-content'
import { RegisterForm } from '@/components/auth/register-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Register() {
  return (
    <div>
      <AuthHeader>
        <AuthHeaderTitle>Criar conta</AuthHeaderTitle>
        <AuthHeaderDescription>
          Entre para o VisualSocial! Compartilhe e explore fotos dos seus
          amigos.
        </AuthHeaderDescription>
      </AuthHeader>
      <AuthMainContent>
        <RegisterForm />
        <Link href="/auth/login" className="mt-6">
          <Button variant="link">Já possui uma conta?</Button>
        </Link>
      </AuthMainContent>
    </div>
  )
}
