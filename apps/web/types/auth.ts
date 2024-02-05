export type RefreshToken = {
  value: string
  expiresIn: number
  tokenId: number
}
export type AccessToken = {
  value: string
  expiresIn: number
}

export type Tokens = {
  accessToken: AccessToken
  refreshToken: RefreshToken
}

export type User = {
  id: number
  name: string
  username: string
  email: string
  bio: string
  profilePictureUrl: string
}
