import { z } from 'zod'

export const postSchema = z.object({
  description: z.string().min(1, {
    message: 'O campo é obrigatório',
  }),
  images: z.array(z.instanceof(File)),
})
