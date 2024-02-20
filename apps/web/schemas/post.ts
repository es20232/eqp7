import { z } from 'zod'

export const postSchema = z.object({
  description: z.string(),
  images: z.any().refine((files) => files && files.length > 0, {
    message: 'Selecione pelo menos uma imagem',
  }),
})
