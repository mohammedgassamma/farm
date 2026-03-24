import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { useAuth } from "@/providers/AuthProvider";
import { API_URLS } from "../apiRoute";
import { TSubscriptionConfig } from "@/server/services/subscription-config.service";
import { useQuery } from "@tanstack/react-query";

export const usePaginatedSubscriptionsConfigs = () => {
  const { currentUser } = useAuth();

  return usePaginatedFetch<TSubscriptionConfig>({
    queryKey: [API_URLS.GET_ALL_SUBSCRIPTIONS_CONFIGS],
    enabled: !!currentUser ? true : false,
  });
};

export const useGetSubscriptionConfigById = ({
  id = "basic",
}: {
  id?: string;
}) => {
  const { currentUser } = useAuth();

  return useQuery<TSubscriptionConfig>({
    queryKey: [API_URLS.GET_SUBSCRIPTION_CONFIGS, id],
    enabled: !!currentUser ? true : false,
  });
};
