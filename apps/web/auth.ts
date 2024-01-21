import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

declare module 'next-auth' {
  interface Session {
    user: {
      email: string
      userRole: string
      accessToken: string
    }
  }
  interface JWT {
    tokenId: string
    refreshToken: string
    expiresIn?: number
  }
}

export const authConfig = {
  debug: true,
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const apiURL = process.env.NEXT_PUBLIC_API_URL

        const res = await fetch(`${apiURL}/auth/sign-in`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: credentials?.username,
            password: credentials?.password,
          }),
        })
        const response = await res.json()

        if (!res.ok) {
          throw new Error(
            JSON.stringify({ errors: response, status: res.status }),
          )
        }
        return response
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        return {
          ...token,
          ...user,
          expiresIn: Math.floor(Date.now() / 1000 + 10),
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user = token as any
      return session
    },
  },
} satisfies NextAuthConfig

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig)
