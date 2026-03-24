"use client";

import BackButton from "@/components/back-button";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "../reusables/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { PATH_URLS } from "@/app/apiClient/apiRoute";

export const AppLayout = ({
  children,
  hasLogo,
  hasPartialLogo,
  hasLanguageSwitcher = false,
  hasBottomBack = false,
  className,
  backTo,
}: {
  children: React.ReactNode;
  hasLogo?: boolean;
  hasPartialLogo?: boolean;
  hasLogout?: boolean;
  hasLanguageSwitcher?: boolean;
  hasBottomBack?: boolean;
  className?: string;
  backTo?: string;
}) => {
  const router = useRouter();
  const t = useTranslations("common");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative">
      <div
        className="min-h-screen w-full max-w-md bg-white rounded-md shadow-md bggreen h-full flex-1 relative
      flex flex-col
      "
      >
        <div className=" ">
          {hasLanguageSwitcher ? <LanguageSwitcher /> : null}
        </div>
        {hasPartialLogo ? (
          <div className="">
            {/* Gamou Logo */}
            <img src="/images/gamou-logo.png" alt="Gamou Logo" />
          </div>
        ) : null}
        {hasLogo ? (
          <div className="">
            {/* Gamou Logo */}
            <img src="/images/gamou-logo.png" alt="Gamou Logo" />
            <img src="/images/Logox.jpg" alt="Gamou Logo" />
          </div>
        ) : null}
        <div className={`flex-1  h-full ${className}`}>{children}</div>
        {hasBottomBack ? (
          <div className="sticky bottom-0 w-full bg-white flex justify-center mt-auto">
            <BackButton to={backTo} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
