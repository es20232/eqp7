import { z } from 'zod'

export const passwordSchema = z
  .string({
    required_error: 'O campo é obrigatório',
  })
  .min(6, { message: 'Sua senha deve ter no mínimo 6 caracteres' })
  .regex(/[a-z]/, {
    message: 'Sua senha deve ter pelo menos um letra minúscula',
  })
  .regex(/[A-Z]/, {
    message: 'Sua senha deve ter pelo menos um letra maiúscula',
  })
  .regex(/[0-9]/, {
    message: 'Sua senha deve ter pelo menos um número',
  })
