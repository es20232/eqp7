import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { User } from '@/app/types/auth'

type ReturnType = {
  user?: User
  update: (user: User) => void
}

export function useSession(): ReturnType {
  const [user, setUser] = useState<User | undefined>(undefined)

  useEffect(() => {
    const cookie = Cookies.get('user')
    if (cookie) {
      setUser(JSON.parse(cookie))
    }
  }, [])

  const update = (newUser: User) => {
    Cookies.set('user', JSON.stringify(newUser))
    setUser(newUser)
  }

  return { user, update }
}

export default useSession
