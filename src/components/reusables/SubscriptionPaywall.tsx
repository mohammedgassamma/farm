"use client";
import React, { useState } from "react";
import { AppLayout } from "../layout/AppLayout";
import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { PaymentDetails } from "./PaymentDetails";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Key, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { subscriptionController } from "@/server/controllers/subscription.controller";
import { useAuth } from "@/providers/AuthProvider";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ContactFooter } from "./ContactFooter";
import { useGetSubscriptionConfigById } from "@/app/apiClient/hooks/useGetSubscriptionConfigs";
import { useUserCurrency } from "@/hooks/useUserCurrency";

export const SubscriptionPaywall = () => {
  const [paymentMethod, setPaymentMethod] = useState<
    "orange-money" | "bank-details"
  >("orange-money");
  const { dbUser, refetchDbUser } = useAuth();

  const t = useTranslations("subscriptionScreen");
  const { data } = useGetSubscriptionConfigById({});
  const { formatCurrency, secondaryCurrency } = useUserCurrency();

  const [subscriptionCode, setSubscriptionCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    try {
      const response = await subscriptionController.activate(
        dbUser?.id || "",
        subscriptionCode
      );

      if (response.success) {
        showToast({
          type: "success",
          message: "Subscription activated successfully",
        });
        await refetchDbUser();
        router.push(PATH_URLS.HOME_SCREEN);
      } else {
        showToast({
          type: "error",
          message: response.message || "Failed to activate subscription",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        message: "Error verifying subscription code",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <AppLayout
        hasPartialLogo
        hasBottomBack
        backTo={PATH_URLS.HOME_SCREEN}
        className="p-4 md:p-6 w-full"
      >
        <div className="space-y-4">
          <header className="text-3xl font-bold my-4 text-center">
            <h1>{t("main.subscriptionTitle")}</h1>
          </header>

          <PaymentDetails
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
          <Card className="mb-6 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                {t("card.title")}
              </CardTitle>
              <CardDescription>{t("card.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              {data?.amount ? (
                <div className="py-4 w-full text-center border-2 mb-4 border-dashed">
                  <p className="text-sm">{t("main.amount")}</p>
                  <h3 className="text-xl font-bold text-primary">
                    {formatCurrency({
                      number: data?.amount,
                      currency: secondaryCurrency,
                    })}
                  </h3>
                </div>
              ) : null}

              <div className="space-y-4">
                {/* <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                        Payment Completed?
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Once your payment is confirmed, you'll receive a
                        subscription code. Enter it here to unlock full access
                        to the app.
                      </p>
                    </div>
                  </div>
                </div> */}

                <div className="space-y-2">
                  <Label
                    htmlFor="subscription-code"
                    className="text-sm font-medium"
                  >
                    {t("card.subscriptionCode.label")}
                  </Label>
                  <Input
                    id="subscription-code"
                    type="text"
                    placeholder={t("card.subscriptionCode.placeholder")}
                    value={subscriptionCode}
                    onChange={(e) => setSubscriptionCode(e.target.value)}
                    className="text-center text-lg font-mono tracking-wider"
                  />
                </div>

                <Button
                  onClick={handleVerifyCode}
                  disabled={!subscriptionCode.trim() || isVerifying}
                  loading={isVerifying}
                  className="w-full"
                  size="lg"
                >
                  <Key className="w-4 h-4 mr-2" />
                  {t("card.activateButton")}
                </Button>

                <div className="text-center pt-2">
                  <ContactFooter className="!text-sm" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </div>
  );
};
