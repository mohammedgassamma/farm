"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useTranslations } from "next-intl";
import { AppLoader } from "@/components/reusables/AppLoader";
import { useAuth } from "@/providers/AuthProvider";
import { PATH_URLS } from "@/app/apiClient/apiRoute";
import {
  useGetAllOrders,
  usePaginatedOrders,
} from "@/app/apiClient/hooks/useGetOrders";
import { OrderCard } from "./_components/OrderCard";
import { LoadMoreButton } from "@/components/reusables/LoadMoreButton";

export default function AdminOrders() {
  const t = useTranslations("agricultureScreen.main");

  const {
    items: orders = [],
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaginatedOrders();

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
          <h1>Admin Orders</h1>
        </header>

        <div className="w-full border-b border-black mb-5"></div>

        <AppLoader isLoading={isLoading}>
          <div className="w-full space-y-[1rem]">
            {!orders.length ? (
              <p>No orders available.</p>
            ) : (
              orders.map((order) => <OrderCard key={order.id} order={order} />)
            )}
          </div>
          <LoadMoreButton
            loadMore={fetchNextPage}
            hasNextPage={hasNextPage}
            isLoadingMore={isFetchingNextPage}
          />
        </AppLoader>

        {error && <p className="text-red-500">{error.message}</p>}
      </AppLayout>
    </>
  );
}
