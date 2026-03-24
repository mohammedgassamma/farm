import { cropService, TCrop } from "@/server/services/crop.service";
import { useQuery } from "@tanstack/react-query";
import { API_URLS } from "../apiRoute";
import { useAuth } from "@/providers/AuthProvider";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";

export const useGetCrops = ({ includeUserId }: { includeUserId?: boolean }) => {
  const { currentUser } = useAuth();

  return useQuery<TCrop[]>({
    queryKey: [
      includeUserId ? API_URLS.GET_ALL_CROPS : API_URLS.GET_ALL_CROPS_BY_ADMIN,
    ],
    enabled: !!currentUser ? true : false,
  });
};

export const usePaginatedCrops = () => {
  const { currentUser } = useAuth();

  return usePaginatedFetch<TCrop>({
    queryKey: [API_URLS.GET_ALL_CROPS],
    enabled: !!currentUser ? true : false,
  });
};

export const useGetCropById = ({
  id,
  initialData,
}: {
  id: string;
  initialData?: TCrop;
}) => {
  const { currentUser } = useAuth();

  return useQuery<TCrop>({
    queryKey: [API_URLS.GET_ALL_CROPS, id],
    initialData,
    enabled: !!currentUser && !!id ? true : false,
  });
};

type TCropDataAggregate = {
  totalProfit: number;
  totalRevenue: number;
  totalExpenses: number;
  totalLandInProduction: number;
};

export const useGetCropsAggregate = ({
  includeUserId,
}: {
  initialData?: TCropDataAggregate;
  includeUserId?: boolean;
}) => {
  const { currentUser } = useAuth();

  return useQuery<TCropDataAggregate>({
    queryKey: [API_URLS.GET_ALL_CROPS_AGGREGATE],
    select: (data) => ({
      totalProfit: data?.totalProfit ?? 0,
      totalRevenue: data?.totalRevenue ?? 0,
      totalExpenses: data?.totalExpenses ?? 0,
      totalLandInProduction: data?.totalLandInProduction ?? 0,
    }),

    enabled: !!currentUser ? true : false,
    queryFn: () => getCropsData({ includeUserId }),
  });
};

const getCropsData = async ({
  includeUserId,
}: {
  includeUserId?: boolean;
}): Promise<TCropDataAggregate> => {
  const result = await cropService.getSum({
    filters: {
      totalProfit: "profits",
      totalRevenue: "revenuesPerField",
      totalExpenses: "expensesPerField",
      totalLandInProduction: "area",
    },
    includeUserId,
  });

  return result as unknown as TCropDataAggregate;
  // as unknown as TCropDataAggregate;
};
