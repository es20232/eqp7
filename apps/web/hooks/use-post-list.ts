import { getPosts } from '@/actions/get-posts'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export function usePostList() {
  const { ref, inView } = useInView()

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await getPosts({ cursor: pageParam })
      return { ...data.data }
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor ?? undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

  return {
    inViewRef: ref,
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  }
}
