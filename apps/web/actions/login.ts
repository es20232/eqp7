'use server'

import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/getServerSession'
import { fetchClient } from '@/lib/fetch-client'
import { ActionState } from '@/types/actions'

type LoginParams = {
  credentials: { username: string; password: string }
  callbackUrl?: string
}

export async function login({
  credentials,
  callbackUrl = '/',
}: LoginParams): Promise<ActionState<never>> {
  const response = await fetchClient('/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({
      user: credentials.username,
      password: credentials.password,
    }),
    headers: {
      'Content-type': 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    const unverifiedUser = data.cause === 'unverifiedUser'

    if (unverifiedUser) return redirect('/auth/verify-email')

    return {
      error: data.message,
    }
  }

  const { update } = await getServerSession()
  update(data)

  return redirect(callbackUrl)
}
