import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'

const spinnerVariants = cva(
  'inline-block  animate-spin duration-700 rounded-full',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        default: 'h-5 w-5 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-[3px]',
        xl: 'h-10 w-10 border-[3px]',
      },
      color: {
        primary: 'border-primary/40 border-t-primary',
        default: 'border-white/40 border-t-white',
      },
    },
    defaultVariants: {
      size: 'default',
      color: 'default',
    },
  },
)

type SpinnerProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof spinnerVariants>

export function Spinner({ size, color, className }: SpinnerProps) {
  return (
    <span
      className={cn(spinnerVariants({ size, color }), className)}
      role="status"
      aria-label="carregando"
    >
      <span className="sr-only">Carregando...</span>
    </span>
  )
}
