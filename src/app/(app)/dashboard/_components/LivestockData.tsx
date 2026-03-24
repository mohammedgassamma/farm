import React, { ReactNode } from "react";
import { StatsCard } from "./StatsCard";
import { useGetDashboardData } from "../hooks/useGetDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useUserCurrency } from "@/hooks/useUserCurrency";
import { formatNumberToCurrency } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

export const LivestockData = ({
  totalExpenses,
  totalRevenue,
  totalProfit,
  totalMeatSales,
  totalMilkProduced,
  totalNumberOfFemales,
  totalNumberOfMales,
  totalNumberOfLivestock,
  isLoading,
}: ReturnType<typeof useGetDashboardData>["livestockDistribution"] & {
  isLoading?: boolean;
}) => {
  const t = useTranslations("dashboardScreen.main.livestockDistribution");
  const { isAdmin } = useAuth();

  return (
    <StatsCard title={t("title")}>
      <div className="space-y-[1rem] mt-[1rem]">
        {isAdmin ? null : (
          <>
            <GridContainer>
              <AnalyticsData
                title={t("totalProfit")}
                value={totalProfit}
                isCurrency
                isLoading={isLoading}
                className="!text-black"
              />
            </GridContainer>
            <GridContainer>
              <AnalyticsData
                title={t("totalRevenue")}
                value={totalRevenue}
                isCurrency
                isLoading={isLoading}
                className="text-green-500!"
              />
            </GridContainer>
            <GridContainer>
              <AnalyticsData
                title={t("totalExpenses")}
                value={totalExpenses}
                isCurrency
                isLoading={isLoading}
                className="text-red-500!"
              />
            </GridContainer>
          </>
        )}

        <div className="w-full flex items-center justify-center">
          <AnalyticsData
            title={t("totalNumberOfLivestock")}
            value={totalNumberOfLivestock}
            isLoading={isLoading}
            className="text-green-500"
          />
        </div>

        <GridContainer>
          <AnalyticsData
            title={t("totalNumberOfMales")}
            value={totalNumberOfMales}
            isLoading={isLoading}
            className="text-green-500!"
          />
          <AnalyticsData
            title={t("totalNumberOfFemales")}
            value={totalNumberOfFemales}
            isLoading={isLoading}
            className="text-green-500!"
          />
        </GridContainer>
        <GridContainer>
          <AnalyticsData
            title={t("totalMilk")}
            value={totalMilkProduced}
            isLoading={isLoading}
          />
        </GridContainer>
        <GridContainer>
          <AnalyticsData
            title={t("totalMeat")}
            value={totalMeatSales}
            isLoading={isLoading}
            isCurrency
          />
        </GridContainer>
      </div>
    </StatsCard>
  );
};

export const GridContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full flex items-center justify-center flex-col xs:flex-row gap-[1rem]  ">
      {children}
    </div>
  );
};

export const AnalyticsData = ({
  title,
  value,
  isCurrency,
  isLoading,
  className,
  precision,
}: {
  title: string;
  value: number;
  isCurrency?: boolean;
  isLoading?: boolean;
  className?: string;
  precision?: number;
}) => {
  const { formatCurrency } = useUserCurrency();

  return (
    <div className="w-full  text-center">
      <div>
        <p className="font-semibold text-lg text-gray-700">{title}:</p>
        <p className={`text-xl font-bold text-blue-500 ${className}`}>
          {isLoading ? (
            <Skeleton className="h-5 w-full" />
          ) : isCurrency ? (
            `${formatCurrency({ number: value })}`
          ) : (
            formatNumberToCurrency({ number: value, precision: precision || 0 })
          )}
        </p>
      </div>
    </div>
  );
};
