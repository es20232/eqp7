export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex w-full items-center  justify-center sm:min-h-[100svh]">
      <div className="w-full rounded-lg sm:max-w-lg sm:border sm:shadow-lg">
        {children}
      </div>
    </main>
  )
}
