"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/providers/AuthProvider";
import { PATH_URLS } from "../apiClient/apiRoute";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAdmin } = useAuth();

  // if (!isAdmin) {
  //   return (
  //     <AppLayout
  //       hasPartialLogo
  //       backTo={PATH_URLS.HOME_SCREEN}
  //       hasLanguageSwitcher={false}
  //       hasBottomBack
  //       className="p-6"
  //     >
  //       <h2 className="text-center text-lg font-bold">
  //         Access Denied. Admins Only.
  //       </h2>
  //     </AppLayout>
  //   );
  // }

  return (
    <div
    // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {children}
    </div>
  );
}
