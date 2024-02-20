'use client'

import { usePostList } from '@/hooks/use-post-list'
import { Post } from './post'
import React from 'react'

export function PostList() {
  const {
    inViewRef,
    status,
    data,
    error,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
  } = usePostList()
  return (
    <div>
      {status === 'error' ? (
        <span>Error: {error?.message}</span>
      ) : (
        <>
          <div className="space-y-8">
            {data?.pages.map((page) => (
              <React.Fragment key={page.nextCursor}>
                {page.posts?.map((post) => <Post {...post} key={post.id} />)}
              </React.Fragment>
            ))}
          </div>
          <div>
            <button
              ref={inViewRef}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? 'Carregando...'
                : hasNextPage
                  ? 'Mais resultados'
                  : ''}
            </button>
          </div>
          {isFetching && !isFetchingNextPage && <>Carregando</>}
        </>
      )}
    </div>
  )
}
