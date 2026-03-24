"use client";
import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { useGetProducts } from "@/app/apiClient/hooks/useGetProducts";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppLoader } from "@/components/reusables/AppLoader";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./_components/ProductCard";
import Link from "next/link";

export default function AdminStorePage() {
  const { data: products = [], isLoading, error, refetch } = useGetProducts();
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
          <h1>Admin Farm Store Products</h1>
        </header>

        <div className="w-full border-b border-black mb-5"></div>

        {/* Add Animal Button */}
        <div className="grow">
          <Link href={PATH_URLS.ADMIN_ADD_PRODUCT}>
            <Button
              variant="default"
              size="lg"
              className="p-3  text-white rounded-md  mb-6 !text-lg"
            >
              + Add New Product
            </Button>
          </Link>
        </div>

        <AppLoader isLoading={isLoading}>
          <div className="w-full">
            {!products.length ? (
              <p>No education videos available.</p>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdmin={true}
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
