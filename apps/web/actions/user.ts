'use server'

import { fetchWithAuth } from '@/lib/fetch-with-auth'
import { redirect } from 'next/navigation'

type EditUserParams = {
  name: string
  username: string
  bio: string
}

export async function editUser(params: EditUserParams) {
  const response = await fetchWithAuth('/user/update', {
    method: 'PUT',
    body: JSON.stringify(params),
  })

  const data = await response.json()

  if (response.ok) redirect('/account')

  return {
    error: data.message,
  }
}
