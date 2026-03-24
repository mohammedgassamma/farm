import { useQuery } from "@tanstack/react-query";
import { API_URLS } from "../apiRoute";
import { useAuth } from "@/providers/AuthProvider";
import { TProduct } from "@/server/services/product.service";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";

export const useGetProducts = () => {
  return useQuery<TProduct[]>({
    queryKey: [API_URLS.GET_ALL_PRODUCTS],
  });
};

export const useGetPaginatedProducts = () => {
  const { currentUser } = useAuth();

  return usePaginatedFetch<TProduct>({
    queryKey: [API_URLS.GET_ALL_PRODUCTS],
    enabled: !!currentUser ? true : false,
  });
};

export const useGetProductById = ({ id }: { id: string }) => {
  const { currentUser } = useAuth();

  return useQuery<TProduct>({
    queryKey: [API_URLS.GET_PRODUCTS, id],
    enabled: !!currentUser ? true : false,
  });
};
