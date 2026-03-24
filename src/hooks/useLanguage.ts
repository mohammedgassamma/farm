import { getUserLocale, setUserLocale } from "@/services/locale";
import { useEffect } from "react";

let locale = "en";

export const useLanguage = () => {
  useEffect(() => {
    const fetchLocale = async () => {
      const userLocale = await getUserLocale();
      locale = userLocale;
    };

    fetchLocale();
  }, []);

  const switchLanguage = async (language: string) => {
    locale = language;
    await setUserLocale(language);
  };

  return {
    locale,
    switchLanguage,
  };
};
