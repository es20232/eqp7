import { RequestInit } from 'next/dist/server/web/spec-extension/request'
import { cookies } from 'next/headers'

export async function fetchWithAuth(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = cookies().get('acess_token')?.value

  return fetch(`${apiUrl}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  })
}
