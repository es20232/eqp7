'use server'
import { fetchWithAuth } from '@/lib/fetch-with-auth'
import { ActionState } from '@/types/actions'

type LikeParams = {
  id: number
}
export async function like({ id }: LikeParams): Promise<ActionState<string>> {
  const response = await fetchWithAuth(`/post/${id}/like`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  })
  const data = await response.json()

  if (!response.ok) {
    return {
      error: data.message,
    }
  }
  return {
    data: 'Like dado com sucesso!',
  }
}
