import { BaseService } from "@/server/services/BaseService";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface PaginationResult<T> {
  data: T[];
  lastDoc: any;
  hasMore: boolean;
}

export interface UsePaginationOptions<T> {
  queryKey: (string | number | boolean | null | undefined)[];
  queryFn?: (params: {
    pageParam: any;
    queryKey: any[];
  }) => Promise<PaginationResult<T>>;
  pageSize?: number;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  useDefaultQueryFn?: boolean; // Flag to use default query function
}

const baseService = new BaseService();

// defaultPaginationQueryFunction.ts
export const defaultPaginationQueryFunction = async ({
  queryKey,
  pageParam,
}: {
  queryKey: any[];
  pageParam: any;
}) => {
  const newQueryKey = queryKey[0];
  const pageSize = queryKey[1] || 10; // Get pageSize from queryKey

  if (newQueryKey.includes("?getAll=true")) {
    const data = await baseService.getAllByCollectionNameWithPagination({
      cName: newQueryKey.replace("?getAll=true", ""),
      pageSize,
      lastDoc: pageParam,
    });
    return data;
  }

  // Default: fetch by userId with collection name
  const data = await baseService.findByUserIdWithCollectionNameWithPagination({
    cName: newQueryKey,
    pageSize,
    lastDoc: pageParam,
  });

  return data;
};

// usePagination.ts
export function usePaginatedFetch<T>({
  queryKey,
  queryFn,
  pageSize = 10,
  enabled = true,
  staleTime,
  gcTime,
  useDefaultQueryFn = true,
}: UsePaginationOptions<T>) {
  const query = useInfiniteQuery({
    queryKey: [...queryKey, pageSize],
    queryFn: async ({ pageParam, queryKey: qKey }) => {
      // Use default query function if specified, otherwise use custom queryFn
      if (useDefaultQueryFn) {
        const defaultFetch = await defaultPaginationQueryFunction({
          queryKey: qKey,
          pageParam,
        });

        return defaultFetch;
      }

      if (!queryFn) {
        throw new Error("queryFn is required when useDefaultQueryFn is false");
      }

      return await queryFn({ pageParam, queryKey: qKey });
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.lastDoc : undefined;
    },
    enabled,
    staleTime,
    gcTime,
  });

  // Flatten all pages into a single array
  //   console.log("Query Data:", query.data);
  const allItems = (query.data?.pages.flatMap(
    (page) => (page as unknown as any).data
  ) ?? []) as T[];

  return {
    ...query,
    items: allItems,
    totalPages: query.data?.pages.length ?? 0,
  };
}
