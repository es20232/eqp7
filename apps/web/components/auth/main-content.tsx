export function AuthMainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col items-center px-5 py-8 sm:px-10">
      {children}
    </main>
  )
}
