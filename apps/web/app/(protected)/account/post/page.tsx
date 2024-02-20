import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CreatePost } from '@/components/posts/create-post'
import { ArrowLeft } from 'lucide-react'

export default async function CreatePostPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col justify-between p-5">
      <header className="mb-8 flex items-center space-x-2 border-b pb-2">
        <Link href="/account">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <h3 className="text-xl font-semibold md:text-2xl">Nova publicação</h3>
      </header>
      <CreatePost />
    </div>
  )
}
