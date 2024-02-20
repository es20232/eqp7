import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProfileMoreActions } from '@/components/account/profile-more-actions'
import { getServerSession } from '@/lib/auth/getServerSession'
import { ProfilePicture } from '../../../components/account/profile-picture'
import { PostGallery } from '@/components/account/post-gallery'
import { fetchWithAuth } from '@/lib/fetch-with-auth'
import { Post } from '@/types/post'
import { Plus } from 'lucide-react'

export default async function Account() {
  const {
    session: { user },
  } = await getServerSession()

  const response = await fetchWithAuth(`/user/${user?.id}/posts?take=100`, {
    next: {
      tags: ['profile-posts'],
    },
  })
  const data = await response.json()
  const posts: Post[] = data.data

  return (
    <main className="mx-auto my-8 max-w-7xl px-4">
      <section className="relative grid grid-cols-[min-content_1fr_min-content] grid-rows-[min-content_min-content] justify-between">
        <ProfilePicture />
        <div className="col-span-3 row-start-2 mt-6 flex w-full flex-col lg:col-start-2 lg:row-start-1 lg:ml-8 lg:mt-0">
          <h2 className="text-xl font-semibold md:text-2xl">{user?.name}</h2>
          <span className="text-sm text-muted-foreground">
            @{user?.username}
          </span>
          <p className="mt-4 max-w-[75ch] overflow-hidden text-ellipsis text-sm md:text-base lg:max-w-md">
            {user?.bio}
          </p>
        </div>
        <div className="col-start-3 row-start-1 flex space-x-2">
          <Link href="/account/post">
            <Button>
              <Plus className="mr-2 size-4" />
              Nova Publicação
            </Button>
          </Link>
          <ProfileMoreActions />
        </div>
      </section>
      <section className="mt-6">
        <header className="mb-4 flex items-center space-x-1 border-b pb-4">
          <h2 className="text-2xl font-semibold">Galeria</h2>
          <span className="text-sm text-muted-foreground">
            ({posts.length})
          </span>
        </header>
        <PostGallery posts={posts} />
      </section>
    </main>
  )
}
