import { z } from 'zod'
import { usernameSchema } from './username'
import { passwordSchema } from './password'

export const accountSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  email: z
    .string({
      required_error: 'O campo é obrigatório',
    })
    .email({
      message: 'Insira um endereço de email válido',
    }),
  name: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
  photo: z.instanceof(File).optional(),
})
