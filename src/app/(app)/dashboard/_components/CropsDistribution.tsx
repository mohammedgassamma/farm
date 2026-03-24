import React from "react";
import { StatsCard } from "./StatsCard";
import { useGetDashboardData } from "../hooks/useGetDashboardData";
import { AnalyticsData, GridContainer } from "./LivestockData";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";

export const CropsDistribution = ({
  totalExpenses,
  totalRevenue,
  totalProfit,
  totalLandInProduction,
  isLoading,
}: ReturnType<typeof useGetDashboardData>["cropDistribution"] & {
  isLoading?: boolean;
}) => {
  const t = useTranslations("dashboardScreen.main.cropDistribution");

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

        <GridContainer>
          <AnalyticsData
            title={t("totalLand")}
            value={totalLandInProduction}
            isLoading={isLoading}
            precision={3}
          />
        </GridContainer>
      </div>
    </StatsCard>
  );
};
