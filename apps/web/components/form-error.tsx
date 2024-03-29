import { AlertTriangle } from 'lucide-react'

interface FormErrorProps {
  message?: string
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 self-start" />
      <p>{message}</p>
    </div>
  )
}
