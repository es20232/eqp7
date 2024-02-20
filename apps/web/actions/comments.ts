'use server'

import { fetchWithAuth } from '@/lib/fetch-with-auth'
import { ActionState } from '@/types/actions'
import { Comment } from '@/types/post'

type AddCommentInputType = {
  postId: number
  comment: string
}

export async function addComment({
  postId,
  comment,
}: AddCommentInputType): Promise<ActionState<string>> {
  const body = { comment }
  const response = await fetchWithAuth(`/post/${postId}/comment`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    return { error: data.message ?? 'Ocorreu um erro inesperado' }
  }

  return { data: 'Comentário adicionado com sucesso' }
}

type GetCommentsInputType = {
  postId: number
}

type GetCommentsReturnType = Comment[]

export async function getComments({
  postId,
}: GetCommentsInputType): Promise<ActionState<GetCommentsReturnType>> {
  const response = await fetchWithAuth(`/post/${postId}/comments?take=100`)
  const data = await response.json()

  if (!response.ok) {
    return {
      error: data.message ?? 'Não foi possível buscar as comentários',
    }
  }

  const { data: comments } = data

  return {
    data: comments,
  }
}

type DeleteCommentInputType = {
  id: number
  postId: number
}

export async function deleteComment({
  id,
  postId,
}: DeleteCommentInputType): Promise<ActionState<string>> {
  const response = await fetchWithAuth(`/post/${postId}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const data = await response.json()
    return { error: data.message ?? 'Ocorreu um erro inesperado' }
  }

  return { data: 'Comentário excluido com sucesso' }
}
