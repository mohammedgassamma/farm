import { QueryClient } from "@tanstack/react-query";

import { BaseService } from "@/server/services/BaseService";

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

const baseService = new BaseService();

export const defaultQueryFn = async ({ queryKey }: { queryKey: any }) => {
  if (queryKey.length === 1) {
    const newQueryKey = queryKey[0];

    if (newQueryKey.includes("?getAll=true")) {
      const data = await baseService.getAllByCollectionName({
        cName: newQueryKey.replace("?getAll=true", ""),
      });
      return data;
    }

    // If queryKey has 1 element, fetch by collection name
    const data = await baseService.findByUserIdWithCollectionName({
      cName: newQueryKey,
    });

    return data;
  } else {
    const dataById = await baseService.findByIdWithCollectionName({
      id: queryKey[1],
      cName: queryKey[0],
    });
    return dataById;
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      // retry: 1,
      retry: false,
      //   refetchOnmount: false,
      //   refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      networkMode: "offlineFirst",
      staleTime: twentyFourHoursInMs,
      refetchInterval: 5 * 60 * 1000, // 3 minutes
    },
  },
});
