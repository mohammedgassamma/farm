import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import React from "react";

export const ContactFooter = ({ className }: { className?: string }) => {
  const t = useTranslations("common");
  return (
    <div className={cn("  text-center", className)}>
      <p>{t("contactUs")}: </p>
      <ul className="list-disc list-inside">
        <li>
          <a
            href="mailto:gamoufarmsapp@gmail.com"
            className="text-gray-700 hover:underline"
          >
            gamoufarmsapp@gmail.com
          </a>
        </li>
        <li>
          <a
            href="https://wa.me/16085779910"
            className="text-gray-700 hover:underline"
            target="_blank"
          >
            WhatsApp
          </a>
        </li>
      </ul>
    </div>
  );
};
