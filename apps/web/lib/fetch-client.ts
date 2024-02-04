'use server'

import { RequestInit } from 'next/dist/server/web/spec-extension/request'
import { API_URL } from './env'

export async function fetchClient(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  return fetch(`${API_URL}${url}`, {
    ...options,
  })
}
