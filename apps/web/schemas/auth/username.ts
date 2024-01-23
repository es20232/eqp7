import { z } from 'zod'

export const usernameSchema = z
  .string({
    required_error: 'O campo é obrigatório',
  })
  .min(4, { message: 'O campo deve ter no mínimo 4 caracteres' })
  .max(20, { message: 'O campo deve ter no no máximo 20 caracteres' })
  .regex(/^[a-zA-Z0-9]+$/, {
    message: 'o campo deve possuir apenas letras e números.',
  })
