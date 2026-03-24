"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { ContactFooter } from "@/components/reusables/ContactFooter";
import { InstallPrompt } from "@/components/reusables/InstallApp";
import { SubscriptionNoticeCard } from "@/components/reusables/SubscriptionNoticeCard";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const HomeScreenClientPage = () => {
  const t = useTranslations("homeScreen");

  return (
    <>
      <AppLayout hasLogo={true} hasLogout={true} hasLanguageSwitcher>
        <div className="p-6 pt-2 px-6 space-y-[1rem]">
          <section className="">
            <header className="text-3xl font-bold mb-1 text-center">
              <h1 translate="no">{t("headerTitle")}</h1>
            </header>

            <div className="w-full border-b border-black mb-5"></div>

            <SubscriptionNoticeCard />
            <div className="w-full grid grid-cols-2 grid-rows-3 gap-x-8 gap-y-3 justify-items-center">
              {/* Crops Button with Label */}
              <div className="text-center">
                <Link href="/crops" className="">
                  <Button
                    variant="default"
                    className="nav-button crops"
                  ></Button>
                  <p className="text-md">{t("agriculture")}</p>
                </Link>
              </div>

              {/* Livestock Button with Label */}
              <div className="text-center">
                <Link href="/livestock" className="">
                  <Button
                    variant="default"
                    className="nav-button livestock"
                  ></Button>
                  <p className="text-md">{t("livestock")}</p>
                </Link>
              </div>

              {/* Dashboard Button with Label */}

              <div className="text-center">
                <Link href="/dashboard" className="">
                  <Button
                    variant="default"
                    className="nav-button dashboard"
                  ></Button>
                  <p className=" text-md">{t("dashboard")}</p>
                </Link>
              </div>

              {/* Education Button with Label */}
              <div className="text-center">
                <Link href="/education">
                  <Button
                    variant="default"
                    className="nav-button education"
                  ></Button>
                  <p className=" text-md">{t("education")}</p>
                </Link>
              </div>

              {/* Store Button with Label */}
              <Link href="/store">
                <div className="text-center">
                  <Button
                    variant="default"
                    className="nav-button store"
                  ></Button>
                  <p className=" text-md">{t("store")}</p>
                </div>
              </Link>

              {/* Connection Button with Label */}
              <Link href="/connection">
                <div className="text-center">
                  <Button
                    variant="default"
                    className="nav-button connection"
                  ></Button>
                  <p className=" text-md">{t("connection")}</p>
                </div>
              </Link>
            </div>
          </section>
          <InstallPrompt />

          <ContactFooter />
        </div>
      </AppLayout>
    </>
  );
};
