// hooks/useComments.ts
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchCommentCount, fetchComments } from "../utils/fetchComments";

export function useComments({
  parentId,
  isChildComment,
  initialPageSize,
  pageSize,
  sort,
}) {
  const { data: commentCount, isLoading: isCountLoading } = useQuery({
    queryKey: ["commentCount", parentId],
    queryFn: () => fetchCommentCount(parentId, isChildComment),
  });

  const infiniteQuery = useInfiniteQuery({
    queryKey: ["comments", parentId],
    queryFn: ({
      pageParam = {
        totalFetched: 0,
        page: 0,
        lastItemData: {},
      },
    }) => {
      const { totalFetched, page, lastItemData } = pageParam;
      const result = fetchComments({
        parentId,
        isChildComment,
        initialPageSize,
        pageSize,
        sort,

        totalFetched,
        page,
        lastItemData,
      });
      return result;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (
        lastPage.length < (allPages.length === 1 ? initialPageSize : pageSize)
      )
        return undefined;
      return {
        totalFetched: allPages.flat().length,
        page: allPages.length,
        lastItemData: lastPage.at(-1),
      };
    },
  });

  return {
    ...infiniteQuery,
    commentCount,
    isCountLoading,
  };
}
