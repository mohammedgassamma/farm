import { ContactFooter } from "@/components/reusables/ContactFooter";
import {
  BANK_DETAILS,
  ORANGE_MONEY_DETAILS,
} from "@/components/reusables/PaymentDetails";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export const OrderSummary = ({
  total,
  checkoutCode,
  isCheckingOut,
  handleCheckout,
  closeCheckout,
  paymentMethod,
}: {
  total: string;
  checkoutCode: string;
  isCheckingOut: boolean;
  handleCheckout: ({ bankDetails }: { bankDetails: any }) => void;
  closeCheckout: () => void;
  paymentMethod: "orange-money" | "bank-details";
}) => {
  const t = useTranslations("cartScreen.checkout.orderSummary");
  return (
    <Card className="mb-6 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-center">
          <div className=" justify-between items-center p-2 bg-muted rounded-lg">
            <p className="font-medium">{t("totalAmount")}</p>
            <p className="text-2xl font-bold text-primary">${total}</p>
            <p className="text-sm font-semibold">{t("shippingNotice")}</p>
          </div>
          <div>
            <h3 className="text-sm text-center">{t("checkoutCode")}</h3>
            <h3 className="text-xl font-bold text-center">{checkoutCode}</h3>
          </div>
          <div className="space-y-1 mt-[1rem] text-left">
            <ul>
              <li className="text-md list-disc list-inside">
                {t("instruction__one")}
              </li>
              <li className="text-md list-disc list-inside">
                {t("instruction__two")}
              </li>
              <li className="text-md list-disc list-inside">
                {t("instruction__three")}
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <Button
              onClick={() =>
                handleCheckout({
                  bankDetails:
                    paymentMethod === "bank-details"
                      ? BANK_DETAILS
                      : ORANGE_MONEY_DETAILS,
                })
              }
              variant="default"
              loading={isCheckingOut}
              className="mb-4  text-white w-32"
            >
              {t("confirmCheckoutButton")}
            </Button>
            <Button
              onClick={() => closeCheckout()}
              variant="outline"
              loading={isCheckingOut}
              className="mb-4  text-white w-32"
            >
              {t("cancelCheckoutButton")}
            </Button>
            <div className="text-center ">
              <ContactFooter className="!text-sm" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
