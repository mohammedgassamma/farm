import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { useGetSubscriptionConfigById } from "@/app/apiClient/hooks/useGetSubscriptionConfigs";
import { useUserCurrency } from "@/hooks/useUserCurrency";
import { useAuth } from "@/providers/AuthProvider";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export const SubscriptionNoticeCard = () => {
  const { formatCurrency, secondaryCurrency } = useUserCurrency();
  const t = useTranslations("subscriptionConfigScreen.noticeCard");

  const { hasSubscriptionExpired } = useAuth();

  const { data } = useGetSubscriptionConfigById({});

  if (!data || !hasSubscriptionExpired) {
    return null;
  }

  const amount = data ? data.amount : 0;

  return (
    <Link href={PATH_URLS.SUBSCRIPTION_SCREEN}>
      <div>
        <p className="bg-red-800 shadow-sm rounded-md my-4 px-2 py-2 !text-white !text-sm !text-center">
          <span>
            {t("message", {
              amount: formatCurrency({
                number: amount,
                currency: secondaryCurrency,
              }),
            })}{" "}
          </span>
          <span>
            <strong className="underline font-semibold">
              {t("payNowButton")}
            </strong>
          </span>
        </p>
      </div>
    </Link>
  );
};
