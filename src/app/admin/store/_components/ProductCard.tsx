import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { Button } from "@/components/ui/button";
import { useUserCurrency } from "@/hooks/useUserCurrency";
import { showToast } from "@/lib/toast";
import { productController } from "@/server/controllers/product.controller";
import { TProduct } from "@/server/services/product.service";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const ProductCard = ({
  product,
  addToCart,
  isAdmin,
  inCart,
  refetch,
  removeFromCart,
}: {
  product: TProduct;
  addToCart?: (product: TProduct) => void;
  isAdmin?: boolean;
  inCart?: boolean;
  refetch?: () => void;
  removeFromCart?: ({ productId }: { productId: string }) => void;
}) => {
  const t = useTranslations("storeScreen.main.card");
  const [isDeleting, setIsDeleting] = useState(false);
  const { secondaryCurrency, formatCurrency } = useUserCurrency();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await productController.deleteProduct({ id: product.id });
      showToast({
        type: "success",
        message: "Product deleted successfully",
      });
      refetch?.();
    } catch (error) {
      showToast({
        type: "error",
        message: "Failed to delete product",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 bgcards rounded-lg shadow-md cursor-pointer hover:bg-gray-100 mb-8">
      <div className="h-[200px] relative">
        <Image
          src={product.imageURL}
          alt={product.name}
          fill
          className="w-full h-40 object-cover rounded-t-lg storeImage"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.description}</p>
        <p className="text-xl font-bold mt-2">
          {formatCurrency({
            number: product.price,
            currency: secondaryCurrency,
          })}
        </p>
        {!isAdmin ? (
          <Button
            variant={inCart ? "destructive" : "default"}
            className="w-full mt-4"
            onClick={() => {
              if (inCart) {
                removeFromCart?.({ productId: product.id });
              } else {
                addToCart?.(product);
              }
            }}
          >
            {inCart ? t("removeFromCart") : t("addToCart")}
          </Button>
        ) : null}
        {isAdmin ? (
          <>
            <Link href={PATH_URLS.ADMIN_EDIT_PRODUCT(product.id)}>
              <Button variant="outline" className="w-full mt-2">
                Edit
              </Button>
            </Link>
            <Button
              onClick={handleDelete}
              variant="destructive"
              loading={isDeleting}
              className="w-full mt-2"
            >
              Delete
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
};
