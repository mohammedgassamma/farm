"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  TrashIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { TCrop } from "@/server/services/crop.service";
import { cropController } from "@/server/controllers/crop.controller";
import { showToast } from "@/lib/toast";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { AppLoader } from "@/components/reusables/AppLoader";
import Link from "next/link";
import {
  useGetCropsAggregate,
  usePaginatedCrops,
} from "@/app/apiClient/hooks"; 
import { API_URLS } from "@/app/apiClient/apiRoute";
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch";
import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { LoadMoreButton } from "@/components/reusables/LoadMoreButton";
import { useUserCurrency } from "@/hooks/useUserCurrency";
import {
  exportToExcel,
  formatCropsForExport,
} from "@/lib/useExportExcel";

export const CropsClientsPage = () => {
  const t = useTranslations("agricultureScreen.main");
  const { formatCurrency } = useUserCurrency();

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [cropToDelete, setCropToDelete] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const cropData = useGetCropsAggregate({ includeUserId: true });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

  const {
    items: crops,
    isLoading,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePaginatedFetch<TCrop>({
    queryKey: [API_URLS.GET_ALL_CROPS_WITH_USER],
  });

  const handleDeleteConfirmation = (cropId: string) => {
    setConfirmDelete(true);
    setCropToDelete(cropId);
  };

  const deleteCrop = async () => {
    if (cropToDelete) {
      try {
        await cropController.deleteCrop({ id: cropToDelete });
        setConfirmDelete(false);
        setCropToDelete(null);
        refetch();
        showToast({ message: "Crop deleted successfully", type: "success" });
      } catch (err) {
        showToast({ message: "Error deleting crop", type: "error" });
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
      const dataToExport = formatCropsForExport(filteredCrops);
      exportToExcel({
        data: dataToExport,
        fileName: `agriculture_${new Date().toISOString().split("T")[0]}`,
        sheetName: "Agriculture",
      });
      showToast({ message: "Export réussi", type: "success" });
    } catch (error) {
      showToast({ message: "Erreur lors de l'export", type: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  const filteredCrops = crops.filter(
      (crop) =>
          crop.fieldNumber
              .toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
          crop.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <>
        <AppLayout
            hasPartialLogo
            hasLanguageSwitcher={false}
            hasBottomBack
            backTo={PATH_URLS.HOME_SCREEN}
        >
          <section className="p-4 md:p-6 w-full">
            <header className="text-4xl font-bold my-4 text-center justify-items-center w-full justify-center items-center">
              <Image
                  src="/images/crops/croplogo.png"
                  alt="Crops"
                  className="w-25 h-25 bg-white rounded-sm"
                  width={100}
                  height={100}
              />
            </header>
            <div className="w-full border-b border-black mb-5"></div>

            <div className="mb-6 bgcards p-6 rounded-md">
              <p className="font-semibold text-lg text-center underline">
                {t("fieldSummary")}
              </p>
              <p className="font-semibold text-lg">
                {t("income")}:{" "}
                <span className="text-green-500">
                {formatCurrency({ number: cropData?.data?.totalRevenue || 0 })}
              </span>
              </p>
              <p className="font-semibold text-lg">
                {t("cost")}:{" "}
                <span className="text-red-500">
                {formatCurrency({ number: cropData?.data?.totalExpenses || 0 })}
              </span>
              </p>
              <p className="font-semibold text-lg">
                {t("profitAndLoss")}:{" "}
                {formatCurrency({ number: cropData?.data?.totalProfit || 0 })}
              </p>
            </div>

            {/* Barre d'actions */}
            <div className="mb-4 flex justify-between gap-2">
              <div className="w-10">
                <Button
                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                    size={"lg"}
                >
                  <MagnifyingGlassIcon />
                </Button>
              </div>

              {isSearchVisible && (
                  <div className="w-full flex">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by Identification"
                        className="w-full h-10 border border-gray-300 rounded-md bg-white nomargin"
                    />
                    {searchQuery && (
                        <XCircleIcon
                            className="w-10 h-10 text-gray-500 cursor-pointer"
                            onClick={clearSearch}
                        />
                    )}
                  </div>
              )}
              

              {/* Bouton Export Excel */}
              <Button
                  variant="outline"
                  size="lg"
                  onClick={handleExport}
                  disabled={isExporting || filteredCrops.length === 0}
                  className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                {isSearchVisible ? "" : "Excel"}
              </Button>

              {/* Bouton Ajouter */}
              <div className="grow">
                <Link href={PATH_URLS.ADD_CROP}>
                  <Button
                      variant="default"
                      size="lg"
                      className="p-3 text-white rounded-md mb-6 !text-lg"
                  >
                    + {isSearchVisible ? "" : t("addNewCrop")}
                  </Button>
                </Link>
              </div>
            </div>

            <AppLoader isLoading={isLoading} loadingText={t("loadingCrops")}>
              <div className="w-full">
                {filteredCrops.length === 0 ? (
                    <p>{t("noCropsFound")}</p>
                ) : (
                    filteredCrops.map((crop) => (
                        <CropCard
                            key={crop.id}
                            crop={crop}
                            handleDeleteConfirmation={handleDeleteConfirmation}
                        />
                    ))
                )}
              </div>
            </AppLoader>
            <LoadMoreButton
                loadMore={fetchNextPage}
                hasNextPage={hasNextPage}
                isLoadingMore={isFetchingNextPage}
            />
            {error && <p className="text-red-500">{error.message}</p>}
          </section>

          <section>
            {confirmDelete && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-md shadow-md">
                    <p className="text-lg font-semibold mb-4">
                      {t("deleteCrop.confirmMessage")}
                    </p>
                    <div className="space-x-4">
                      <Button
                          onClick={deleteCrop}
                          variant="default"
                          className="mb-4 bg-red-500 text-white w-32"
                      >
                        {t("deleteCrop.deleteButton")}
                      </Button>
                      <Button
                          onClick={() => setConfirmDelete(false)}
                          variant="outline"
                          className="w-32"
                      >
                        {t("deleteCrop.cancelButton")}
                      </Button>
                    </div>
                  </div>
                </div>
            )}
          </section>
        </AppLayout>
      </>
  );
};

const CropCard = ({
                    crop,
                    handleDeleteConfirmation,
                  }: {
  crop: TCrop;
  handleDeleteConfirmation: (id: string) => void;
}) => {
  const t = useTranslations("agricultureScreen.main");
  const { formatCurrency } = useUserCurrency();

  return (
      <div
          key={crop.id}
          className="p-6 bgcards shadow-lg rounded-md border border-gray-200 hover:bg-gray-100 cursor-pointer mb-5"
      >
        <section className="flex w-full gap-[1rem] border-b mb-4 pb-2">
          <div className="text-xl flex-1 font-semibold text-center border-gray-400">
            {t("cropCard.fieldLabel")}: {crop.fieldNumber}
          </div>
          <div>
            <Button
                onClick={() => handleDeleteConfirmation(crop.id)}
                variant="default"
                className="w-10 h-10 p-0 bg-red-500 text-white rounded-full flex justify-center items-center"
            >
              <TrashIcon className="w-6 h-6" />
            </Button>
          </div>
        </section>
        <div className="flex items-center space-x-4">
          <img
              src="/images/Crop.png"
              alt="Field"
              className="w-25 h-25 border-2 border-gray-300"
          />
          <div className="flex flex-wrap gap-[1rem] justify-between w-full">
            <div>
              <p className="text-sm text-gray-500">
                {t("cropCard.cropPlanted")}: {crop.crop}
              </p>
              <p className="text-sm text-gray-500">
                {t("cropCard.expenses")}:{" "}
                <span className="text-red-500">
                {formatCurrency({ number: crop.expensesPerField })}
              </span>
              </p>
              <p className="text-sm text-gray-500">
                {t("cropCard.revenues")}:{" "}
                <span className="text-green-500">
                {formatCurrency({ number: crop.revenuesPerField })}
              </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xl font-bold text-right">
            {t("cropCard.profit")}: {formatCurrency({ number: crop.profits })}
          </p>
          {crop.note != "" ? (
              <div className="w-full mt-4">
                <p className="text-sm text-gray-500 font-semibold">Notes: </p>
                <pre className="text-sm text-gray-500 text-wrap border border-gray-300 p-2">
              {crop.note}
            </pre>
              </div>
          ) : (
              ""
          )}
        </div>
        <div className="space-y-2">
          <Link href={PATH_URLS.EDIT_CROP(crop.id ?? "")}>
            <Button
                variant="default"
                className="w-full mt-4 py-2 text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white transition-all"
            >
              {t("cropCard.editCrop")}
            </Button>
          </Link>
        </div>
      </div>
  );
};
