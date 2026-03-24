import { AppStorage } from "@/lib/appStorage";
import { formatNumberToCurrency } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { userController } from "@/server/controllers/user.controller";
import { useCallback, useEffect, useMemo, useState } from "react";

const { getFromStore, addToStore } = AppStorage();

const ALTERNATIVE_CURRENCY = "FCFA";

export const useUserCurrency = () => {
  const { dbUser, currentUser } = useAuth();

  const currencyFromStorage = useMemo(() => {
    if (!currentUser) return null;
    return getFromStore(`currency_${currentUser.uid}`);
  }, [currentUser]);

  const initialCurrency = useMemo(() => {
    return dbUser?.currency || currencyFromStorage || "XAF";
  }, [dbUser, currencyFromStorage]);

  const [currency, setCurrency] = useState(initialCurrency);

  useEffect(() => {
    setCurrency(initialCurrency);
  }, [initialCurrency]);

  const saveCurrencyToStorage = (currency: string) => {
    if (!currentUser) return;
    setCurrency(currency);
    addToStore(`currency_${currentUser.uid}`, currency);
    userController.updateCurrency({ id: currentUser.uid, currency });
  };

  const formatCurrency = useCallback(
    ({
      number,
      currency = ALTERNATIVE_CURRENCY,
    }: {
      number: number;
      currency?: string;
    }) => {
      return `${formatNumberToCurrency({
        number,
        // currencyCode: currency,
        removeCurrency: true,
      })} ${currency}`;
    },
    [currency]
  );

  return {
    currency,
    saveCurrencyToStorage,
    formatCurrency,
    secondaryCurrency: ALTERNATIVE_CURRENCY,
  };
};
