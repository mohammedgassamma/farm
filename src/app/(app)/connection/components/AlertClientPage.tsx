"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"; // ShadCN's DropdownMenu
import { Bars3Icon } from "@heroicons/react/24/outline"; // Heroicons hamburger icon
import { AppLayout } from "@/components/layout/AppLayout";
import { AppLoader } from "@/components/reusables/AppLoader";
import { useGetPaginatedAlerts } from "@/app/apiClient/hooks/useGetAlert";
import { AlertCard } from "@/app/admin/connection/_components/AlertCard";
import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { ContactFooter } from "@/components/reusables/ContactFooter";
import { useTranslations } from "next-intl";
import { LoadMoreButton } from "@/components/reusables/LoadMoreButton";

export const ConnectionClientPage = () => {
  const {
    items: alerts = [],
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetPaginatedAlerts();
  const t = useTranslations("alertsScreen.main");

  const [selectedAlertType, setSelectedAlertType] = useState("all");

  const handleAlertTypeChange = (type: string) => {
    setSelectedAlertType(type);
  };

  const filteredAlerts =
    selectedAlertType === "all"
      ? alerts
      : alerts.filter((alert) => alert.type === selectedAlertType);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <AppLayout
        hasPartialLogo
        hasLanguageSwitcher={false}
        hasBottomBack
        backTo={PATH_URLS.HOME_SCREEN}
        className="p-4 md:p-6 w-full"
      >
        <header className="text-3xl font-bold my-4 text-center">
          <h1>{t("title")}</h1>
        </header>

        <div className="w-full border-b border-black mb-5"></div>

        <div className="w-full mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full p-3 flex justify-between items-center  text-white rounded-md "
              >
                <span>{t("filterAlerts")}</span>
                <Bars3Icon className="text-white text-lg" />{" "}
                {/* Hamburger icon from Heroicons */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
              <DropdownMenuItem onClick={() => handleAlertTypeChange("all")}>
                {t("allAlerts")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAlertTypeChange("system")}>
                {t("systemAlerts")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAlertTypeChange("local")}>
                {t("localAlerts")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAlertTypeChange("economical")}
              >
                {t("economicalAlerts")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-full">
          <p className="w-full text-left">
            {t("filter")}: {selectedAlertType}
          </p>
        </div>

        <AppLoader isLoading={isLoading}>
          <div className="w-full">
            {!filteredAlerts.length ? (
              <p>{t("noAlerts")}</p>
            ) : (
              filteredAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))
            )}
          </div>
          <LoadMoreButton
            hasNextPage={hasNextPage}
            loadMore={fetchNextPage}
            isLoadingMore={isFetchingNextPage}
          />
        </AppLoader>

        <ContactFooter />
      </AppLayout>
    </div>
  );
};

// const [alerts] = useState([
//     {
//       type: "system",
//       title: "App Maintenance",
//       message:
//         "The app will be down for maintenance on 22nd June from 2 AM to 4 AM.",
//       date: new Date().toISOString(),
//     },
//     {
//       type: "local",
//       title: "Excessive Heat Warning",
//       message: "The region will experience temperatures above 40°C tomorrow.",
//       date: new Date().toISOString(),
//     },
//     {
//       type: "economical",
//       title: "High Grain Prices",
//       message: "Grain prices in your area have increased by 10%.",
//       date: new Date().toISOString(),
//     },
//     {
//       type: "local",
//       title: "Drought Alert",
//       message: "Drought conditions are expected to worsen over the next week.",
//       date: new Date().toISOString(),
//     },
//     {
//       type: "economical",
//       title: "Water Price Surge",
//       message:
//         "The price of water for irrigation has surged by 15% in the last week.",
//       date: new Date().toISOString(),
//     },
//     {
//       type: "system",
//       title: "New App Feature",
//       message:
//         "We have added a new feature to track crop yields more efficiently.",
//       date: new Date().toISOString(),
//     },
//   ]);
