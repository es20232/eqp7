'use server'

import { fetchWithAuth } from '@/lib/fetch-with-auth'
import { ActionState } from '@/types/actions'
import { revalidateTag } from 'next/cache'

export async function createPost(
  formData: FormData,
): Promise<ActionState<string>> {
  const response = await fetchWithAuth('/post', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()

  if (!response.ok)
    return {
      error: data.message,
    }

  revalidateTag('profile-posts')

  return {
    data: 'Publicação realizada com sucesso!',
  }
}
