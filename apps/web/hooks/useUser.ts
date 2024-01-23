import { cookies } from 'next/headers'

type User = {
  name: string
  username: string
  email: string
  photo: string
}

export function useUser(): User | undefined {
  const userCookie = cookies().get('user')?.value

  if (!userCookie) return undefined

  const user = JSON.parse(userCookie)

  return user
}
