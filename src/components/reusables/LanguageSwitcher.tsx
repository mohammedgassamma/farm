"use client";
import React from "react";

import Image from "next/image";
import { MoreSettings } from "./MoreSettings";
import { useLanguage } from "@/hooks/useLanguage";

const languages: Record<string, string>[] = [
  { value: "fr", label: "French", icon: "/images/flags/france.png" },
  { value: "en", label: "English", icon: "/images/flags/usa.png" },
  { value: "es", label: "Spanish", icon: "/images/flags/spain.png" },
];

export const LanguageSwitcher = () => {
  const { switchLanguage, locale } = useLanguage();

  const selectedLanguage = languages.find((lang) => lang.value === locale);
  const languageLabel = selectedLanguage ? selectedLanguage.label : "Language";

  return (
    <section className="flex">
      <MoreSettings />

      <div
        className="flex items-center justify-center !gap-[3rem] py-[0.5rem]   w-full"
        style={{
          gap: "1.5rem",
        }}
      >
        {languages.map(({ value, label, icon }) => (
          <div
            role="button"
            className="w-[35px] h-[20px] relative cursor-pointer"
            key={value}
            onClick={() => switchLanguage(value)}
          >
            <Image src={icon} alt={label} fill />
          </div>
        ))}
      </div>
      {/* <div className="p-2 text-zinc-800">
        <Ellipsis />
      </div> */}
    </section>
  );
};
