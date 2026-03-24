"use client";

import { useTranslations } from "next-intl";

import { AppLayout } from "@/components/layout/AppLayout";
import { AppLoader } from "@/components/reusables/AppLoader";
import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { ContactFooter } from "@/components/reusables/ContactFooter";
import { LoadMoreButton } from "@/components/reusables/LoadMoreButton";
import {
  useGetSubscriptionConfigById,
  usePaginatedSubscriptionsConfigs,
} from "@/app/apiClient/hooks/useGetSubscriptionConfigs";
import { SubscriptionConfigCard } from "./SubscriptionConfigCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const SubscriptionClientPage = () => {
  const {
    items: subscriptionConfigs = [],
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePaginatedSubscriptionsConfigs();
  const t = useTranslations("alertsScreen.main");

  const { data, isPending } = useGetSubscriptionConfigById({});

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <AppLayout
        hasPartialLogo
        hasLanguageSwitcher={false}
        hasBottomBack
        backTo={PATH_URLS.ADMIN}
        className="p-4 md:p-6 w-full"
      >
        <header className="text-3xl font-bold my-4 text-center">
          <h1>Subscription Config</h1>
        </header>

        <div className="w-full border-b border-black mb-5"></div>

        <div className="grow">
          {!data && !isPending ? (
            <Link href={PATH_URLS.ADMIN_ADD_SUBSCRIPTION_CONFIG}>
              <Button
                variant="default"
                size="lg"
                className="p-3  text-white rounded-md  mb-6 !text-lg"
              >
                + Add New
              </Button>
            </Link>
          ) : null}
        </div>

        <AppLoader isLoading={isLoading}>
          <div className="w-full">
            {!subscriptionConfigs.length ? (
              <p>{t("noSubscriptionConfigs")}</p>
            ) : (
              subscriptionConfigs.map((subscriptionConfig) => (
                <SubscriptionConfigCard
                  key={subscriptionConfig.id}
                  subscriptionConfig={subscriptionConfig}
                  canEdit
                />
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
