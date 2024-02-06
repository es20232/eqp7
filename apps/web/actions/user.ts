'use server'

import { getServerSession } from '@/lib/auth/getServerSession'
import { fetchWithAuth } from '@/lib/fetch-with-auth'
import { ActionState } from '@/types/actions'

export async function editUser(params: FormData): Promise<ActionState<string>> {
  const response = await fetchWithAuth('/user/update', {
    method: 'PUT',
    body: params,
  })

  const data = await response.json()

  if (!response.ok)
    return {
      error: data.message,
    }

  const { update } = await getServerSession()
  update({ user: data.updatedUserResponse })

  return {
    data: 'Dados do perfil atualizados com sucesso!',
  }
}
