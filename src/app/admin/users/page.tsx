"use client";

import { PATH_URLS, API_URLS } from "@/app/apiClient/apiRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppLoader } from "@/components/reusables/AppLoader";
import { useGetPaginatedUsers } from "@/app/apiClient/hooks";
import { UserCard } from "./_components/UserCard";
import { LoadMoreButton } from "@/components/reusables/LoadMoreButton";
import { exportAllUsersToExcel } from "@/lib/exportAllUsersExcel";
import { showToast } from "@/lib/toast";

import { Button } from "@/components/ui/button"; // ✅ FIX
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"; // ✅ FIX
import { useState } from "react"; // ✅ pour loading
import { getAllUsersFullData } from "@/lib/getAllUsersFullData"; 
import  { useTranslations } from "next-intl"; // ✅ pour les traductions

export default function Userpage() {
  const {
    items: users = [],
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetPaginatedUsers();

  const [isExporting, setIsExporting] = useState(false); // ✅ UX propre

  
const tExport  = useTranslations("export");
const handleExportAllUsers = async () => {
  try {
    setIsExporting(true);

    const data = await getAllUsersFullData();

    exportAllUsersToExcel({
      livestockData: data.livestock,
      cropsData: data.crops,
      t: tExport,
    });

    showToast({ message: "Export global réussi", type: "success" });
  } catch (err) {
    console.error(err);
    showToast({ message: "Erreur export global", type: "error" });
  } finally {
    setIsExporting(false);
  }
};
  return (
    <AppLayout
      hasPartialLogo
      hasLanguageSwitcher={false}
      hasBottomBack
      backTo={PATH_URLS.ADMIN}
      className="p-4 md:p-6 w-full"
    >
      <header className="text-3xl font-bold my-4 text-center">
        <h1>Admin Users</h1>
      </header>

      <div className="w-full border-b border-black mb-5"></div>

      {/* ✅ Zone actions propre */}
      <div className="mb-6 flex justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={handleExportAllUsers}
          disabled={isExporting}
          className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          {isExporting ? "Exporting..." : "Export All Users"}
        </Button>
      </div>

      <AppLoader isLoading={isLoading}>
        <div className="w-full space-y-3">
          {!users.length ? (
            <p>No users available.</p>
          ) : (
            users.map((user) => (
              <UserCard key={user.id} user={user} refetch={refetch} />
            ))
          )}
        </div>

        <LoadMoreButton
          hasNextPage={hasNextPage}
          loadMore={fetchNextPage}
          isLoadingMore={isFetchingNextPage}
        />
      </AppLoader>

      {error && <p className="text-red-500">{error.message}</p>}
    </AppLayout>
  );
}