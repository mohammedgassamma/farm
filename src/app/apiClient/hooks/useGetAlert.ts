import { useQuery } from "@tanstack/react-query";
import { API_URLS } from "../apiRoute";
import { useAuth } from "@/providers/AuthProvider";
import { TAlert } from "@/server/services/alert.service";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";

export const useGetAlerts = () => {
  return useQuery<TAlert[]>({
    queryKey: [API_URLS.GET_ALL_ALERTS],
  });
};

export const useGetPaginatedAlerts = () => {
  const { currentUser } = useAuth();

  return usePaginatedFetch<TAlert>({
    queryKey: [API_URLS.GET_ALL_ALERTS],
    enabled: !!currentUser ? true : false,
  });
};

export const useGetAlertById = ({ id }: { id: string }) => {
  const { currentUser } = useAuth();

  return useQuery<TAlert>({
    queryKey: [API_URLS.GET_ALERTS, id],
    enabled: !!currentUser ? true : false,
  });
};
