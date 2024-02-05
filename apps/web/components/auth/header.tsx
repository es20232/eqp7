import Image from 'next/image'
import Logo from '@/public/logo.svg'

export function AuthHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex flex-col items-center justify-center gap-2 bg-gray-50 px-5 py-8 sm:px-10">
      <Image
        src={Logo}
        alt="Visual Social logo"
        className="mb-6 size-12"
        quality={100}
      />
      {children}
    </header>
  )
}

export function AuthHeaderTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-xl font-semibold">{children}</h1>
}

export function AuthHeaderDescription({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <p className="text-center text-sm text-muted-foreground ">{children}</p>
  )
}
