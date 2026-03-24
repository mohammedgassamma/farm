"use client";

import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { InstallPrompt } from "@/components/reusables/InstallApp";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect } from "react";

export const AdminClientScreen = () => {
  const t = useTranslations("homeScreen");

  return (
    <>
      <AppLayout hasLogo={true} hasLogout={true} hasLanguageSwitcher>
        <div className="p-6 space-y-[1rem]">
          <section className="">
            <header className="text-3xl font-bold mb-3 text-center">
              <h1 translate="no">Admin Panel</h1>
            </header>

            <div className="w-full border-b border-black mb-5"></div>

            <div className="w-full grid grid-cols-2 grid-rows-3 gap-x-8 gap-y-3 justify-items-center">
              {/* Education Button with Label */}
              <div className="text-center">
                <Link href={PATH_URLS.ADMIN_DASHBOARD}>
                  <Button
                    variant="default"
                    className="nav-button dashboard"
                  ></Button>
                  <p className="mt-1 text-md">{t("dashboard")}</p>
                </Link>
              </div>
              <div className="text-center">
                <Link href={PATH_URLS.ADMIN_EDUCATION}>
                  <Button
                    variant="default"
                    className="nav-button education"
                  ></Button>
                  <p className="mt-1 text-md">{t("education")}</p>
                </Link>
              </div>

              {/* Store Button with Label */}
              <Link href={PATH_URLS.ADMIN_STORE}>
                <div className="text-center">
                  <Button
                    variant="default"
                    className="nav-button store"
                  ></Button>
                  <p className="mt-1 text-md">{t("store")}</p>
                </div>
              </Link>

              {/* Connection Button with Label */}
              <Link href={PATH_URLS.ADMIN_ALERTS}>
                <div className="text-center">
                  <Button
                    variant="default"
                    className="nav-button connection"
                  ></Button>
                  <p className=" text-md">{t("connection")}</p>
                </div>
              </Link>
              {/* Connection Button with Label */}
              <Link href={PATH_URLS.ADMIN_ORDERS}>
                <div className="text-center">
                  <Button
                    variant="default"
                    className="nav-button store"
                  ></Button>
                  <p className=" text-md">{t("orders")}</p>
                </div>
              </Link>
              <Link href={PATH_URLS.ADMIN_USERS}>
                <div className="text-center">
                  <Button
                    variant="default"
                    className="nav-button connection"
                  ></Button>
                  <p className=" text-md">{t("users")}</p>
                </div>
              </Link>
              <Link href={PATH_URLS.ADMIN_SUBSCRIPTION}>
                <div className="text-center">
                  <Button
                    variant="default"
                    className="nav-button connection"
                  ></Button>
                  <p className=" text-md">Subscriptions</p>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </AppLayout>
    </>
  );
};
