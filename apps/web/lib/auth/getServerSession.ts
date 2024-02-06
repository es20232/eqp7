'use server'

import { AccessToken, RefreshToken, User } from '@/types/auth'
import { cookies } from 'next/headers'

export type ServerSession = {
  user?: User
  accessToken?: AccessToken
  refreshToken?: RefreshToken
}

function updateServerSession({
  accessToken,
  refreshToken,
  user,
}: ServerSession) {
  const cookieStore = cookies()
  user && cookieStore.set('user', JSON.stringify(user))
  accessToken &&
    cookieStore.set('access_token', JSON.stringify(accessToken), {
      httpOnly: true,
    })
  refreshToken &&
    cookieStore.set('refresh_token', JSON.stringify(refreshToken), {
      httpOnly: true,
    })
}

type UpdateServerSession = (session: ServerSession) => void

type GetServerSessionReturn = {
  session: ServerSession
  update: UpdateServerSession
}

export async function getServerSession(): Promise<GetServerSessionReturn> {
  const cookieStore = cookies()

  const accessTokenCookie = cookieStore.get('access_token')?.value
  const accessToken: AccessToken =
    accessTokenCookie && JSON.parse(accessTokenCookie)

  const refreshTokenCookie = cookieStore.get('refresh_token')?.value
  const refreshToken: RefreshToken =
    refreshTokenCookie && JSON.parse(refreshTokenCookie)

  const userCookie = cookieStore.get('user')?.value
  const user: User = userCookie && JSON.parse(userCookie)

  return {
    session: { accessToken, refreshToken, user },
    update: updateServerSession,
  }
}
