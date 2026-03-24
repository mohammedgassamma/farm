"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DownloadIcon, Plus, Share } from "lucide-react";
import { iOS } from "@/lib/utils";
import { useTranslations } from "next-intl";

export const InstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const t = useTranslations("installPrompt");

  useEffect(() => {
    // Check if device is iOS
    setIsIOS(iOS());

    // Check if already installed (running in standalone mode)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Android install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  // Don't show if already installed
  if (isStandalone) return null;

  // iOS Instructions
  if (!installPrompt) {
    return (
      <div
        className="flex items-center gap-2 p-2 bg-primary  text-sm justify-center"
        role="button"
      >
        <p className="text-white">
          {t("full__title")} <Share className="inline w-4 h-4 mx-1" />
          {t("full__description")} <Plus className="inline w-4 h-4 mx-1" />
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 p-2 bg-primary  text-sm justify-center"
      role="button"
      onClick={handleInstall}
    >
      <DownloadIcon className="w-5 h-5 text-white" />
      <p className="text-white">{t("mini__title")}</p>
    </div>
  );
};
