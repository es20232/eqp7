import { MessageCircleOff } from 'lucide-react'

export function CommentsEmptyState() {
  return (
    <div className="my-auto mt-8 flex   flex-col items-center space-y-2">
      <span className="mb-6 rounded-md bg-muted p-4">
        <MessageCircleOff className="size-12 text-muted-foreground" />
      </span>
      <h1 className="text-xl font-semibold ">Nenhum comentário</h1>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        Parece que ninguém deixou um comentário ainda. Seja o primeiro a
        compartilhar seus pensamentos!
      </p>
    </div>
  )
}
