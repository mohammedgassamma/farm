"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Fragment } from "react";
import { useTranslations } from "next-intl";

interface BackButtonProps {
  to?: string; // Optional 'to' prop for custom navigation
  text?: string; // Optional 'text' prop for custom button text
  variant?: string;
  className?: string;
}

export default function BackButton({
  to,
  text,
  variant = "default",
  className,
}: BackButtonProps) {
  const router = useRouter();
  const t = useTranslations("common");

  const handleBackClick = () => {
    if (to) {
      router.push(to);
    } else {
      router.back();
    }
  };

  return (
    <div className="w-full h-[50px]">
      {to ? (
        <Link href={to}>
          <Button
            variant={variant as any}
            className={`flex items-center gap-2 !z-[40] !rounded-none h-full ${
              className || ""
            }`}
          >
            &lt; {text || t("back")}
          </Button>
        </Link>
      ) : (
        <Button
          variant={variant as any}
          className={`flex items-center gap-2 !z-[40] !rounded-none h-full ${
            className || ""
          }`}
          onClick={handleBackClick}
        >
          &lt; {text || t("back")}
        </Button>
      )}
    </div>
  );
}
