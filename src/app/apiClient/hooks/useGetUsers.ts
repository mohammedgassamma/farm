import { useAuth } from "@/providers/AuthProvider";
import { TDbUser, userService } from "@/server/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { API_URLS } from "../apiRoute";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";

export const useGetDbUser = () => {
  const { currentUser } = useAuth();

  return useQuery<TDbUser>({
    queryKey: [API_URLS.GET_USER_BY_ID, currentUser?.uid],
    // enabled: !!currentUser ? true : false,
  });
};

export const useGetPaginatedUsers = () => {
  const { currentUser } = useAuth();

  return usePaginatedFetch<TDbUser>({
    queryKey: [API_URLS.GET_ALL_USERS],
    enabled: !!currentUser ? true : false,
    queryFn: async ({ pageParam, queryKey }) => {
      return userService.getUserWithSubscription({
        lastDoc: pageParam,
        pageSize: 10,
      });
    },
    useDefaultQueryFn: false,
  });
};
