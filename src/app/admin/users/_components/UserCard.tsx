import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showToast } from "@/lib/toast";
import { convertDateFromTimestampFormat } from "@/lib/utils";
import { subscriptionController } from "@/server/controllers/subscription.controller";
import { TDbUser } from "@/server/services/user.service";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Key,
  Mail,
  XCircle,
} from "lucide-react";
import React from "react";

export const UserCard = ({
  user,
  refetch,
}: {
  user: TDbUser;
  refetch: () => void;
}) => {
  const subscription = user.subscription;
  const [isToggling, setIsToggling] = React.useState(false);

  const isActive = ["active", "trial"].includes(subscription?.status || "");

  const isTrialActive = subscription?.status === "trial";

  const toggleSubscriptionActivation = async () => {
    setIsToggling(true);
    try {
      const response = await (isActive
        ? subscriptionController.deactivate(user.id)
        : subscriptionController.activate(
            user.id,
            subscription?.activationCode || ""
          ));

      if (response.success) {
        showToast({
          type: "success",
          message: `Subscription ${
            isActive ? "deactivated" : "activated"
          } successfully`,
        });
        refetch();
        // Handle success
      } else {
        showToast({
          type: "error",
          message: response.message || "Failed to toggle subscription",
        });
      }
    } catch (error) {
    } finally {
      setIsToggling(false);
    }
    // Implement the logic to toggle subscription activation
  };
  const toggleTrialSubscription = async () => {
    setIsToggling(true);
    try {
      const response = await subscriptionController.createTrial(user.id, true);

      if (response.success) {
        showToast({
          type: "success",
          message: `Trial subscription activated successfully`,
        });
        refetch();
        // Handle success
      } else {
        showToast({
          type: "error",
          message: "Failed to toggle trial subscription",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        message: "Failed to toggle trial subscription",
      });
    } finally {
      setIsToggling(false);
    }
    // Implement the logic to toggle subscription activation
  };

  return (
    <Card className="w-full max-w-md !space-y-0 !gap-0 py-3">
      <CardContent className="py- px-4 space-y-2">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Email
          </p>
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <p className="text-xs break-all">{user.email}</p>
          </div>
        </div>

        <div className="space-y-1.5 border-t pt-1.5 mt-1.5 grid grid-cols-2">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Created
            </p>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <p className="text-xs">
                {convertDateFromTimestampFormat(user.createdAt)}
              </p>
            </div>
          </div>

          {user.lastLogin ? (
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Last Login
              </p>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <p className="text-xs">
                  {convertDateFromTimestampFormat(user.lastLogin)}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {subscription && (
          <>
            <div className="space-y-1.5 border-t pt-1.5 mt-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                Subscription
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Status
                  </p>
                  <div className="flex items-center gap-1.5">
                    {subscription.status === "active" ? (
                      <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-600 flex-shrink-0" />
                    )}
                    <p className="text-xs capitalize">{subscription.status}</p>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Trial Used
                  </p>
                  <div className="flex items-center gap-1.5">
                    {subscription.isTrialUsed ? (
                      <CheckCircle2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <XCircle className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    )}
                    <p className="text-xs">
                      {subscription.isTrialUsed ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Start Date
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs">
                      {convertDateFromTimestampFormat(subscription.startDate)}
                    </p>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    End Date
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs">
                      {convertDateFromTimestampFormat(subscription.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              {subscription.activationCode && (
                <div className="space-y-0.5 mt-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Activation Code
                  </p>
                  <div className="flex items-center gap-2">
                    <Key className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs font-mono font-semibold">
                      {subscription.activationCode}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3">
              <Button
                onClick={toggleSubscriptionActivation}
                loading={isToggling}
                variant={isActive ? "default" : "destructive"}
                className={isActive ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {isActive ? "Deactivate Subscription" : "Activate Subscription"}
              </Button>
            </div>
            {!isTrialActive ? (
              <div className="mt-3">
                <Button
                  onClick={toggleTrialSubscription}
                  loading={isToggling}
                  variant={isTrialActive ? "default" : "outline"}
                  className={
                    isTrialActive ? "bg-green-600 hover:bg-green-700" : ""
                  }
                >
                  Enable Trial Subscription
                </Button>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
};
