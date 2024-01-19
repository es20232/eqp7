import Image from 'next/image'

export default function Login() {
  return (
    <main className='grid grid-cols-10 min-h-[100svh]'>
      <section className='bg-slate-100 col-span-7 subgrid place-items-center'>
        <Image src='/login-illus-1x.jpeg' alt='Ilustração' width='800' height='800' />
      </section>
        <section className='col-span-3'>
      </section>
    </main>
  )
}