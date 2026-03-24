import {
  useGetCrops,
  useGetCropsAggregate,
  useGetLivestockAggregate,
} from "@/app/apiClient/hooks";
import {
  useGetFemaleAggregate,
  useGetMaleAggregate,
  useGetTotalMeatProduced,
  useGetTotalMeatSales,
  useGetTotalMilkProduced,
} from "@/app/apiClient/hooks/useGetDashboardExtraData";
import { parseNumericString } from "@/lib/utils";
import { useMemo } from "react";

// Changess

export const useGetDashboardData = ({
  includeUserId,
}: {
  includeUserId: boolean;
}) => {
  const { data: cropDistribution, isLoading: cropsDistributionLoading } =
    useGetCropsAggregate({ includeUserId });

  const { data } = useGetCrops({ includeUserId });

  const { data: livestockData, isLoading: livestockLoading } =
    useGetLivestockAggregate({ includeUserId });

  const { data: maleGenderCount, isLoading: maleLoading } = useGetMaleAggregate(
    { includeUserId },
  );
  const { data: femaleGenderCount, isLoading: femaleLoading } =
    useGetFemaleAggregate({ includeUserId });
  const { data: totalMilkProduced, isLoading: milkLoading } =
    useGetTotalMilkProduced({
      includeUserId,
    });
  const { data: totalMeatSales, isLoading: meatLoading } = useGetTotalMeatSales(
    {
      includeUserId,
    },
  );

  const totalRevenue =
    (livestockData?.totalRevenue || 0) + (cropDistribution?.totalRevenue || 0);

  const totalExpenses =
    (livestockData?.totalExpenses || 0) +
    (cropDistribution?.totalExpenses || 0);

  const totalProfit = useMemo(() => {
    return (
      (livestockData?.totalProfit || 0) + (cropDistribution?.totalProfit || 0)
    );
  }, [livestockData, cropDistribution]);

  const livestockDistribution = useMemo(() => {
    return {
      totalExpenses: livestockData?.totalExpenses || 0,
      totalRevenue: livestockData?.totalRevenue || 0,
      totalProfit: livestockData?.totalProfit || 0,
      totalNumberOfLivestock: (femaleGenderCount || 0) + (maleGenderCount || 0),
      totalNumberOfMales: maleGenderCount || 0,
      totalNumberOfFemales: femaleGenderCount || 0,
      totalMilkProduced: totalMilkProduced?.totalMilkProduced || 0,
      totalMeatSales: totalMeatSales?.totalMeatSales || 0,
    };
  }, [
    livestockData,
    cropDistribution,
    femaleGenderCount,
    maleGenderCount,
    totalMilkProduced,
    totalMeatSales,
  ]);

  const areaTotal = useMemo(() => {
    if (!data || data.length === 0) return 0;

    return data.reduce(
      (acc, crop) => acc + (parseNumericString(crop?.area || "0") || 0),
      0,
    );
  }, [data]);

  return {
    totalProfit,
    totalRevenue,
    totalExpenses,
    livestockDistribution,
    cropDistribution: {
      totalProfit: cropDistribution?.totalProfit ?? 0,
      totalRevenue: cropDistribution?.totalRevenue ?? 0,
      totalExpenses: cropDistribution?.totalExpenses ?? 0,
      totalLandInProduction: areaTotal,
    },
    cropsDistributionLoading,
    livestockLoading,
    maleGenderCount,
    maleLoading,
    femaleGenderCount,
    femaleLoading,
    totalMilkProduced,
    milkLoading,
    totalMeatSales,
    meatLoading,
  };
};
