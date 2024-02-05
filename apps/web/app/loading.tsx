import { Spinner } from '@/components/ui/spinner'

export default function Loading() {
  return (
    <div className="flex w-full justify-center pt-8 ">
      <Spinner size="xl" color="primary" />
    </div>
  )
}

