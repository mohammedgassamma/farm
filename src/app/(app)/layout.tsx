"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/providers/AuthProvider";
import { PATH_URLS } from "../apiClient/apiRoute";
import { SubscriptionPaywall } from "@/components/reusables/SubscriptionPaywall";
import { useEffect } from "react";

export default function SubscriptionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    hasSubscriptionExpired,
    hasFetchSubscription,
    triggerFetchWithSubscription,
  } = useAuth();

  useEffect(() => {
    if (!hasFetchSubscription) {
      triggerFetchWithSubscription();
    }
  }, [hasFetchSubscription]);

  if (!hasFetchSubscription) {
    return null;
  }

  if (hasSubscriptionExpired) {
    return <SubscriptionPaywall />;
  }

  return (
    <div
    // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {children}
    </div>
  );
}
