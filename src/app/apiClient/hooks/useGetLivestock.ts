import { useQuery } from "@tanstack/react-query";
import { API_URLS } from "../apiRoute";
import { useAuth } from "@/providers/AuthProvider";
import {
  livestockService,
  TLivestock,
} from "@/server/services/livestock.service";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";

export const useGetLivestocks = () => {
  const { currentUser } = useAuth();

  return useQuery<TLivestock[]>({
    queryKey: [API_URLS.GET_ALL_ANIMALS],
    enabled: !!currentUser ? true : false,
  });
};

export const useGetPaginatedLivestocks = () => {
  const { currentUser } = useAuth();

  return usePaginatedFetch<TLivestock>({
    queryKey: [API_URLS.GET_ALL_ANIMALS],
    enabled: !!currentUser ? true : false,
  });
};

export const useGetLivestockById = ({
  id,
  initialData,
}: {
  id: string;
  initialData?: TLivestock;
}) => {
  const { currentUser } = useAuth();

  return useQuery<TLivestock>({
    queryKey: [API_URLS.GET_ALL_ANIMALS, id],
    placeholderData: initialData,
    enabled: !!currentUser && !!id ? true : false,
  });
};

type TLivestockAggregate = {
  totalProfit: number;
  totalRevenue: number;
  totalExpenses: number;
};

export const useGetLivestockAggregate = ({
  includeUserId,
}: {
  initialData?: TLivestockAggregate;
  includeUserId?: boolean;
}) => {
  const { currentUser } = useAuth();

  return useQuery<TLivestockAggregate>({
    queryKey: [API_URLS.GET_ALL_LIVESTOCK_AGGREGATE],
    enabled: !!currentUser ? true : false,
    select: (data) => ({
      totalProfit: data?.totalProfit ?? 0,
      totalRevenue: data?.totalRevenue ?? 0,
      totalExpenses: data?.totalExpenses ?? 0,
    }),
    queryFn: () => getLivestockData({ includeUserId }),
  });
};

const getLivestockData = async ({
  includeUserId,
}: {
  includeUserId?: boolean;
}): Promise<TLivestockAggregate> => {
  const result = await livestockService.getSum({
    filters: {
      totalProfit: "totalProfit",
      totalRevenue: "totalIncome",
      totalExpenses: "totalCost",
      // totalMilkProduced: "totalMilkProduced",
      // totalMeatProduced: "amountOfMeat",
    },
    includeUserId,
  });

  return result as unknown as TLivestockAggregate;
  // as unknown as TCropDataAggregate;
};
