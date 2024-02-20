'use server'
import { fetchWithAuth } from '@/lib/fetch-with-auth'
import { ActionState } from '@/types/actions'

type DeslikeParams = {
  id: number
}
export async function deslike({
  id,
}: DeslikeParams): Promise<ActionState<string>> {
  const response = await fetchWithAuth(`/post/${id}/deslike`, {
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
    data: 'Deslike dado com sucesso!',
  }
}
