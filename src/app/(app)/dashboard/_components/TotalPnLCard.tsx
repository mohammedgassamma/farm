import { Skeleton } from "@/components/ui/skeleton";
import { useUserCurrency } from "@/hooks/useUserCurrency";
import { useTranslations } from "next-intl";
import React from "react";

export const TotalPnLCard = ({
  totalProfit,
  totalRevenue,
  totalExpenses,
  isLoading,
}: {
  totalProfit: number;
  totalRevenue: number;
  totalExpenses: number;
  isLoading?: boolean;
}) => {
  const t = useTranslations("dashboardScreen.main");
  const { formatCurrency } = useUserCurrency();
  return (
    <div className="bgcards p-3 rounded-md mb-3 justify-items-center border-2 border-gray-300 shadow-lg">
      <div className="w-full flex flex-col items-center">
        <div className="w-[90%] text-center mb-2 border-b border-gray-400 pb-4">
          <div>
            <p className="font-semibold text-lg text-gray-700">
              {t("statCard.profit")}:
            </p>
            <p className={`text-xl font-bold `}>
              {isLoading ? (
                <Skeleton className="h-5 w-full" />
              ) : (
                `${formatCurrency({ number: totalProfit })}`
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Revenue and Expenses Section */}
      <div className="w-full flex flex-col items-center  justify-center">
        {/* Total Revenue - Left Justified */}
        <div className="w-45 p-4 text-center w-full">
          <div>
            <p className="font-semibold text-lg text-gray-700">
              {t("statCard.totalRevenue")}:
            </p>
            <p className="text-xl font-bold text-green-500">
              {isLoading ? (
                <Skeleton className="h-5 w-full" />
              ) : (
                `${formatCurrency({ number: totalRevenue })}`
              )}
            </p>
          </div>
        </div>

        {/* <div className="grow justify-items-center">
          <div className="border-l border-gray-400 min-h-[50px]"></div>
        </div> */}

        {/* Total Expenses - Right Justified */}
        <div className="w-45 p-4 text-center w-full">
          <div>
            <p className="font-semibold text-lg text-gray-700">
              {t("statCard.totalExpenses")}:
            </p>
            <p className="text-xl font-bold text-red-500">
              {isLoading ? (
                <Skeleton className="h-5 w-full" />
              ) : (
                `${formatCurrency({ number: totalExpenses })}`
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
