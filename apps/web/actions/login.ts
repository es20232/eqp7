'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import process from 'process'

type LoginParams = {
  credentials: { username: string; password: string }
  callbackUrl?: string
}

export async function login({ credentials }: LoginParams) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`,
    {
      method: 'POST',
      body: JSON.stringify({
        user: credentials.username,
        password: credentials.password,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    },
  )

  const data = await response.json()

  if (!response.ok) {
    const unverifiedUser = data.cause === 'unverifiedUser'

    if (unverifiedUser) return redirect('/auth/verify-email')

    return {
      error: data.message,
    }
  }

  const cookieStore = cookies()

  cookieStore.set('user', JSON.stringify(data.user))
  cookieStore.set('access_token', JSON.stringify(data.accessToken), {
    httpOnly: true,
  })
  cookieStore.set('refresh_token', JSON.stringify(data.refreshToken), {
    httpOnly: true,
  })

  return redirect('/')
}
