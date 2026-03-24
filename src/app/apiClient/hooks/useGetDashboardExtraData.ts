import { useAuth } from "@/providers/AuthProvider";
import { livestockService } from "@/server/services/livestock.service";
import { useQuery } from "@tanstack/react-query";
import { API_URLS } from "../apiRoute";

const getMaleGenderCount = ({ includeUserId }: { includeUserId: boolean }) => {
  return livestockService.getCount({
    options: { filters: [{ field: "sex", value: "male", operator: "==" }] },
    includeUserId,
  });
};

const getFemaleGenderCount = ({
  includeUserId,
}: {
  includeUserId: boolean;
}) => {
  return livestockService.getCount({
    options: {
      filters: [{ field: "sex", value: "female", operator: "==" }],
    },
    includeUserId,
  });
};

const getTotalMilkProduced = ({
  includeUserId,
}: {
  includeUserId: boolean;
}) => {
  return livestockService.getSum({
    filters: {
      totalMilkProduced: "totalMilkProduced",
    },
    includeUserId,
  }) as unknown as TTotalMilkProduced;
};

const getTotalMeatProduced = ({
  includeUserId,
}: {
  includeUserId: boolean;
}) => {
  return livestockService.getSum({
    filters: {
      totalMeatProduced: "amountOfMeat",
    },
    includeUserId,
  }) as unknown as TMeatProduced;
};
const getTotalMeatSales = ({ includeUserId }: { includeUserId: boolean }) => {
  return livestockService.getSum({
    filters: {
      totalMeatSales: "salePrice",
    },
    includeUserId,
  }) as unknown as TMeatSales;
};

export const useGetMaleAggregate = ({
  includeUserId = false,
}: {
  includeUserId?: boolean;
}) => {
  const { currentUser } = useAuth();

  return useQuery<number>({
    queryKey: [API_URLS.GET_MALE_LIVESTOCK_COUNT],
    placeholderData: 0,
    enabled: !!currentUser ? true : false,
    queryFn: () => getMaleGenderCount({ includeUserId }),
  });
};

export const useGetFemaleAggregate = ({
  includeUserId = false,
}: {
  includeUserId?: boolean;
}) => {
  const { currentUser } = useAuth();

  return useQuery<number>({
    queryKey: [API_URLS.GET_FEMALE_LIVESTOCK_COUNT],
    placeholderData: 0,
    enabled: !!currentUser ? true : false,
    queryFn: () => getFemaleGenderCount({ includeUserId }),
  });
};

type TTotalMilkProduced = {
  totalMilkProduced: number;
};

type TMeatProduced = {
  totalMeatProduced: number;
};
type TMeatSales = {
  totalMeatSales: number;
};

export const useGetTotalMilkProduced = ({
  includeUserId = false,
}: {
  includeUserId?: boolean;
}) => {
  const { currentUser } = useAuth();

  return useQuery<TTotalMilkProduced>({
    queryKey: [API_URLS.GET_TOTAL_MILK_PRODUCED],
    placeholderData: { totalMilkProduced: 0 },
    enabled: !!currentUser ? true : false,
    queryFn: () => getTotalMilkProduced({ includeUserId }),
  });
};

export const useGetTotalMeatProduced = ({
  includeUserId = false,
}: {
  includeUserId?: boolean;
}) => {
  const { currentUser } = useAuth();

  return useQuery<TMeatProduced>({
    queryKey: [API_URLS.GET_TOTAL_MEAT_PRODUCED],
    placeholderData: { totalMeatProduced: 0 },
    enabled: !!currentUser ? true : false,
    queryFn: () => getTotalMeatProduced({ includeUserId }),
  });
};
export const useGetTotalMeatSales = ({
  includeUserId = false,
}: {
  includeUserId?: boolean;
}) => {
  const { currentUser } = useAuth();

  return useQuery<TMeatSales>({
    queryKey: [API_URLS.GET_TOTAL_LIVESTOCK_SALE_PRICE],
    placeholderData: { totalMeatSales: 0 },
    enabled: !!currentUser ? true : false,
    queryFn: () => getTotalMeatSales({ includeUserId }),
  });
};
