"use client";

import { ProductCard } from "../admin/store/_components/ProductCard";
import { AppLayout } from "@/components/layout/AppLayout";
import { PATH_URLS } from "../apiClient/apiRoute";
import { AppLoader } from "@/components/reusables/AppLoader";
import {
  useGetPaginatedProducts,
  useGetProducts,
} from "../apiClient/hooks/useGetProducts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetUserCart } from "@/hooks/useGetCart";
import { ShoppingCartIcon } from "lucide-react";
import { LoadMoreButton } from "@/components/reusables/LoadMoreButton";
import { useTranslations } from "next-intl";

export default function StorePage() {
  const {
    items: products = [],
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetPaginatedProducts();

  const { cart, handleAddToCart, handleRemoveItem } = useGetUserCart();
  const t = useTranslations("storeScreen.main");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <AppLayout
        hasPartialLogo
        hasBottomBack
        backTo={PATH_URLS.HOME_SCREEN}
        className="p-4 md:p-6 w-full"
      >
        <header className="text-3xl font-bold my-4 text-center">
          <h1>Gamoufarms Store</h1>
        </header>
        <div className="w-full border-b border-black mb-5"></div>
        <Link href={PATH_URLS.STORE_CART}>
          <div className="mb-4 flex  w-full">
            <Button className="flex items-center gap-2">
              <ShoppingCartIcon />
              {t("viewCart")} ({cart.products.length})
            </Button>
          </div>
        </Link>
        <AppLoader isLoading={isLoading}>
          <div className="w-full">
            {!products.length ? (
              <p>{t("noProductsFound")}</p>
            ) : (
              products.map((item, index) => {
                const inCart = cart.products.find(
                  (prod) => prod.id === item.id
                );
                return (
                  <ProductCard
                    product={item}
                    addToCart={handleAddToCart}
                    inCart={!!inCart}
                    key={index}
                    removeFromCart={handleRemoveItem}
                  />
                );
              })
            )}
          </div>
          <LoadMoreButton
            hasNextPage={hasNextPage}
            loadMore={fetchNextPage}
            isLoadingMore={isFetchingNextPage}
          />
        </AppLoader>
      </AppLayout>
    </div>
  );
}
