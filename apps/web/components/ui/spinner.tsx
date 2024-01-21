import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'

const spinnerVariants = cva(
  'inline-block  animate-spin duration-700 rounded-full border-2 border-white/40 border-t-white  ',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-10 w-10',
      },
      color: {
        default: 'text-primary',
        white: 'text-white',
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
