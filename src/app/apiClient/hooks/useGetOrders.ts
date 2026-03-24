import { useQuery } from "@tanstack/react-query";
import { API_URLS } from "../apiRoute";
import { TOrder } from "@/server/services/order.service";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { useAuth } from "@/providers/AuthProvider";

export const useGetAllOrders = () => {
  return useQuery<TOrder[]>({
    queryKey: [API_URLS.GET_ALL_ORDERS],
  });
};

export const usePaginatedOrders = () => {
  const { currentUser } = useAuth();

  return usePaginatedFetch<TOrder>({
    queryKey: [API_URLS.GET_ALL_ORDERS],
    enabled: !!currentUser ? true : false,
  });
};
