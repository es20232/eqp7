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
