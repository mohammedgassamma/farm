"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useTranslations } from "next-intl";
import { AppLoader } from "@/components/reusables/AppLoader";
import { useAuth } from "@/providers/AuthProvider";
import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCard } from "./_components/AlertCard";
import { useGetAlerts } from "@/app/apiClient/hooks/useGetAlert";

export default function AlertPage() {
  const t = useTranslations("agricultureScreen.main");

  const { data: educations = [], isLoading, error, refetch } = useGetAlerts();
  const { isAdmin } = useAuth();

  return (
    <>
      <AppLayout
        hasPartialLogo
        hasLanguageSwitcher={false}
        hasBottomBack
        backTo={PATH_URLS.ADMIN}
        className="p-4 md:p-6 w-full"
      >
        <header className="text-3xl font-bold my-4 text-center">
          <h1>Admin Alerts</h1>
        </header>

        <div className="w-full border-b border-black mb-5"></div>

        {/* Add Animal Button */}
        <div className="grow">
          <Link href={PATH_URLS.ADMIN_ADD_ALERT}>
            <Button
              variant="default"
              size="lg"
              className="p-3  text-white rounded-md  mb-6 !text-lg"
            >
              + Add New
            </Button>
          </Link>
        </div>

        <AppLoader isLoading={isLoading}>
          <div className="w-full">
            {!educations.length ? (
              <p>No alert available.</p>
            ) : (
              educations.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  canEdit={isAdmin}
                  refetch={refetch}
                />
              ))
            )}
          </div>
        </AppLoader>

        {error && <p className="text-red-500">{error.message}</p>}
      </AppLayout>
    </>
  );
}
