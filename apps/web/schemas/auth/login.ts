import { z } from 'zod'
import { usernameSchema } from './username'
import { passwordSchema } from './password'

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
})
