'use server'

import { fetchWithAuth } from '@/lib/fetch-with-auth'
import { ActionState } from '@/types/actions'
import { Post } from '@/types/post'

type InputType = {
  cursor?: number
}

type ReturnType = {
  posts: Post[]
  nextCursor: number | null
  previousCursor: number | null
}

export async function getPosts({
  cursor = 1,
}: InputType): Promise<ActionState<ReturnType>> {
  const response = await fetchWithAuth(`/post?cursor=${cursor}`)
  const data = await response.json()

  if (!response.ok) {
    return {
      error: data.message ?? 'Não foi possível buscar as publicações',
    }
  }

  const {
    data: posts,
    meta: { cursor: newCursor, hasMore },
  } = data

  const nextCursor = hasMore ? newCursor : null

  console.log(newCursor)

  return {
    data: {
      posts,
      nextCursor,
      previousCursor: cursor,
    },
  }
}
