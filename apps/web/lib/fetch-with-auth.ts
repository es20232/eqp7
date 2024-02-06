'use server'

import { RequestInit } from 'next/dist/server/web/spec-extension/request'
import { API_URL } from './env'
import { getServerSession } from './auth/getServerSession'

export async function fetchWithAuth(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const {
    session: { accessToken },
  } = await getServerSession()

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options?.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken.value}` }),
    },
  })
}
