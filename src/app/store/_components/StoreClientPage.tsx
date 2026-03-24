"use client";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/outline"; // Heroicons Trash icon
import { useGetUserCart } from "@/hooks/useGetCart";
import { TProduct } from "@/server/services/product.service";
import { AppLayout } from "@/components/layout/AppLayout";
import { PATH_URLS } from "@/app/apiClient/apiRoute";
import Link from "next/link";
import { useMemo, useState } from "react";
import { generateCode } from "@/lib/utils";
import { orderController } from "@/server/controllers/order.controller";
import { useAuth } from "@/providers/AuthProvider";
import { PaymentDetails } from "@/components/reusables/PaymentDetails";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUserCurrency } from "@/hooks/useUserCurrency";
import { OrderSummary } from "./OrderSummary";

export const StoreClientPage = () => {
  const {
    cart,
    handleUpdateCart,
    totalAmount,
    handleRemoveItem,
    handleClearCart,
  } = useGetUserCart();
  const [confirmCheckout, setConfirmCheckout] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const { formatCurrency, secondaryCurrency } = useUserCurrency();
  const [paymentMethod, setPaymentMethod] = useState<
    "orange-money" | "bank-details"
  >("orange-money");

  const t = useTranslations("cartScreen");

  const cartItems = cart.products || [];
  const { currentUser } = useAuth();
  const router = useRouter();

  const checkoutCode = useMemo(() => {
    return generateCode({ length: 8 });
  }, []);

  const handleCheckout = async ({ bankDetails }: { bankDetails: any }) => {
    try {
      setIsCheckingOut(true);
      await orderController.addOrder({
        payload: {
          userId: currentUser?.uid || "",
          products: cart.products,
          totalAmount: totalAmount,
          code: checkoutCode,
          status: "paid",
          accountDetails: bankDetails,
        },
      });
      handleClearCart();
      showToast({ type: "success", message: t("order.message") });
      router.push(PATH_URLS.STORE);

      // Clear cart or redirect to success page
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <AppLayout
          hasPartialLogo
          hasBottomBack
          backTo={PATH_URLS.STORE}
          className="p-4 md:p-6 w-full"
        >
          <header className="text-3xl font-bold my-4 text-center">
            <h1>{t("main.title")}</h1>
          </header>

          <div className="w-full border-b border-black mb-5"></div>

          <section>
            {!confirmCheckout ? (
              <section>
                <div className="w-full">
                  {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                  ) : (
                    cartItems.map((item) => (
                      <CartProductItem
                        item={item}
                        key={item.id}
                        handleUpdateCart={handleUpdateCart}
                        handleRemoveItem={handleRemoveItem}
                      />
                    ))
                  )}
                </div>

                {/* Checkout Button */}
                <div className="w-full justify-items-center mt-6 ">
                  <p className="w-full text-xl font-semibold mb-4 p-3 bgcards rounded-md text-center">
                    {t("main.total")}:{" "}
                    {formatCurrency({
                      number: totalAmount,
                      currency: secondaryCurrency,
                    })}
                  </p>
                  <div className="space-y-2 w-full">
                    {cartItems?.length ? (
                      <Button
                        variant="default"
                        className=""
                        onClick={() => setConfirmCheckout(true)}
                      >
                        {t("main.proceedToCheckout")}
                      </Button>
                    ) : null}
                    <Link href={PATH_URLS.STORE}>
                      <Button variant="outline" className="">
                        {t("main.addMoreItems")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>
            ) : (
              <div className="space-y-4">
                <PaymentDetails
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
                <OrderSummary
                  total={formatCurrency({
                    number: totalAmount,
                    currency: secondaryCurrency,
                  })}
                  checkoutCode={checkoutCode}
                  isCheckingOut={isCheckingOut}
                  handleCheckout={handleCheckout}
                  closeCheckout={() => setConfirmCheckout(false)}
                  paymentMethod={paymentMethod}
                />
              </div>
            )}
          </section>
        </AppLayout>
      </div>
    </>
  );
};

const CartProductItem = ({
  item,
  handleUpdateCart,
  handleRemoveItem,
}: {
  item: TProduct;
  handleUpdateCart: ({
    productId,
    quantity,
  }: {
    productId: string;
    quantity: number;
  }) => void;
  handleRemoveItem: ({ productId }: { productId: string }) => void;
}) => {
  const t = useTranslations("cartScreen.cartCard");
  const { formatCurrency, secondaryCurrency } = useUserCurrency();

  return (
    <div className="justify-between p-4 bg-white rounded-lg shadow-md mb-4">
      <div className="flex items-center space-x-4">
        <img
          src={item.imageURL}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-md"
        />
        <div>
          <p className="text-lg font-semibold">{item.name}</p>
          <p className="text-sm text-gray-500 mt-3">{item.description}</p>
          <p className="text-xl font-semibold mt-6">
            {t("unitPrice")}:{" "}
            {formatCurrency({
              number: item.price,
              currency: secondaryCurrency,
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="w-10">
          <Button
            onClick={() => {
              handleUpdateCart({
                productId: item.id,
                quantity: item.quantity - 1,
              });
            }}
            className="text-sm w-10 h-10"
          >
            -
          </Button>
        </div>
        <div className="w-20">
          <input
            type="number"
            value={item.quantity}
            min="1"
            onChange={(e) => {
              handleUpdateCart({
                productId: item.id,
                quantity: parseInt(e.target.value),
              });
            }}
            className="w-20 text-center"
          />
        </div>
        <div className="w-10">
          <Button
            onClick={() => {
              handleUpdateCart({
                productId: item.id,
                quantity: item.quantity + 1,
              });
            }}
            className="text-sm w-10 h-10"
          >
            +
          </Button>
        </div>

        <div className="grow">
          <div className="w-10 ml-auto">
            <Button
              variant="outline"
              onClick={() => {
                handleRemoveItem({ productId: item.id });
              }}
              className="text-red-500"
            >
              <TrashIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
