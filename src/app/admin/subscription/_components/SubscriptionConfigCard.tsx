import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserCurrency } from "@/hooks/useUserCurrency";
import { TSubscriptionConfig } from "@/server/services/subscription-config.service";
import Link from "next/link";
import React from "react";

export const SubscriptionConfigCard = ({
  subscriptionConfig,
  canEdit,
}: {
  subscriptionConfig: TSubscriptionConfig;
  canEdit?: boolean;
}) => {
  const { formatCurrency, secondaryCurrency } = useUserCurrency();
  return (
    <Card className="w-full max-w-md !gap-1 py-3 !px-2">
      <CardHeader className="!mb-0 !px-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              Type: {subscriptionConfig.id}{" "}
            </CardTitle>
            <CardDescription className="text-sm text-black">
              Trial Period:{" "}
              <span className="font-bold">
                {subscriptionConfig.trialPeriod} days
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 !px-2">
        {/* Total Amount */}
        <div className="flex items-center space-x-2 text-md">
          <span className="font-semibold">Amount:</span>
          <span className="text-md font-bold text-primary">
            {formatCurrency({
              number: subscriptionConfig.amount,
              currency: secondaryCurrency,
            })}
          </span>
        </div>
        {canEdit ? (
          <div>
            <Link
              href={PATH_URLS.ADMIN_EDIT_SUBSCRIPTION_CONFIG(
                subscriptionConfig.id
              )}
            >
              <Button className="w-full mt-1">Edit</Button>
            </Link>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
