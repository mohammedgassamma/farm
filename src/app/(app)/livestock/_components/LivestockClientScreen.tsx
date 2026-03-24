"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  TrashIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"; // Heroicons trashcan and search icons
import { livestockController } from "@/server/controllers/livestock.controller";
import { showToast } from "@/lib/toast";
import { useTranslations } from "next-intl";
import { formatNumberToCurrency } from "@/lib/utils";
import { TLivestock } from "@/server/services/livestock.service";
import Image from "next/image";
import { AppLoader } from "@/components/reusables/AppLoader";
import { AppLayout } from "@/components/layout/AppLayout";
import Link from "next/link";
import {
  useGetLivestockAggregate,
  useGetPaginatedLivestocks,
} from "@/app/apiClient/hooks";
import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { LoadMoreButton } from "@/components/reusables/LoadMoreButton";
import { useUserCurrency } from "@/hooks/useUserCurrency";

export const LivestockClientScreen = () => {
  const t = useTranslations("animalScreen.main");
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false); // Confirmation for delete
  const [animalToDelete, setAnimalToDelete] = useState<string | null>(null); // Animal ID to be deleted
  const { formatCurrency } = useUserCurrency();

  const {
    items: animals = [],
    isLoading,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetPaginatedLivestocks();

  // State to manage search filter
  const [searchQuery, setSearchQuery] = useState<string>(""); // To store the search query
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false); // Toggle for search input visibility

  // Clear the search query
  const clearSearch = () => {
    setSearchQuery("");
  };

  const { data: livestockData } = useGetLivestockAggregate({
    includeUserId: true,
  });

  // Handle delete confirmation
  const handleDeleteConfirmation = (animalId: string) => {
    setConfirmDelete(true);
    setAnimalToDelete(animalId);
  };

  const deleteAnimal = async () => {
    if (animalToDelete) {
      try {
        await livestockController.deleteLivestock({ id: animalToDelete });

        setConfirmDelete(false);
        setAnimalToDelete(null);
        refetch();
        showToast({
          message: t("deleteAnimal.deleteSuccessful"),
          type: "success",
        });
      } catch (err) {
        showToast({ message: t("deleteAnimal.deleteError"), type: "error" });
      }
    }
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter animals based on search query
  const filteredAnimals = animals.filter((animal) =>
    animal.identification.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AppLayout
        hasPartialLogo
        hasLanguageSwitcher={false}
        className=" p-4 md:p-6"
        hasBottomBack
        backTo={PATH_URLS.HOME_SCREEN}
      >
        <header
          className="text-4xl font-bold my-4 text-center justify-items-center
        w-full justify-center items-center
        "
        >
          <Image
            src="/images/livestock/3cows.png"
            alt="Livestock"
            className="w-25 h-25 bg-white rounded-sm"
            width={100}
            height={100}
          />
        </header>

        <div className="w-full border-b border-black mb-5"></div>

        {/* Total Profit and Underperforming Stats */}
        <div className="mb-6 bgcards p-6 rounded-md">
          <p className="font-semibold text-lg text-center underline">
            {t("fieldSummary")}
          </p>
          <p className="font-semibold text-lg">
            {t("income")}:{" "}
            <span className="text-green-500">
              {formatCurrency({
                number: livestockData?.totalRevenue || 0,
              })}
            </span>
          </p>
          <p className="font-semibold text-lg">
            {t("cost")}:{" "}
            <span className="text-red-500">
              {formatCurrency({
                number: livestockData?.totalExpenses || 0,
              })}
            </span>
          </p>
          <p className="font-semibold text-lg">
            {t("profitAndLoss")}:{" "}
            {formatCurrency({
              number: livestockData?.totalProfit || 0,
            })}
          </p>
        </div>

        {/* Search Button */}
        <div className="mb-4 flex justify-between gap-2">
          {/* Search Icon - Toggle Search Input */}
          <div className="w-10">
            <Button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              size={"lg"}
            >
              <MagnifyingGlassIcon className="" />
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
              {/* Clear search query button */}
              {searchQuery && (
                <XCircleIcon
                  className="w-10 h-10 text-gray-500 cursor-pointer"
                  onClick={clearSearch}
                />
              )}
            </div>
          )}

          {/* Add Animal Button */}
          <div className="grow">
            <Link href={PATH_URLS.ADD_ANIMAL}>
              <Button
                variant="default"
                size="lg"
                className="p-3  text-white rounded-md  mb-6 !text-lg"
              >
                + {isSearchVisible ? "" : t("addNewAnimal")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Conditional Search Input */}

        {/* Animal Cards */}
        <AppLoader isLoading={isLoading} loadingText={t("loadingAnimals")}>
          <div className="w-full">
            {filteredAnimals.length === 0 ? (
              <p>{t("noAnimalsFound")}</p>
            ) : (
              filteredAnimals.map((animal) => (
                <LivestockCard
                  key={animal.id}
                  animal={animal}
                  handleDeleteConfirmation={handleDeleteConfirmation}
                />
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

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <p className="text-lg font-semibold mb-4">
              {t("deleteAnimal.confirmMessage")}
            </p>
            <div className="space-x-4">
              <Button
                onClick={deleteAnimal}
                variant="default"
                className="bg-red-500 text-white w-32 mb-4"
              >
                {t("deleteAnimal.deleteButton")}
              </Button>
              <Button onClick={() => setConfirmDelete(false)} className="w-32">
                {t("deleteAnimal.cancelButton")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const LivestockCard = ({
  animal,
  handleDeleteConfirmation,
}: {
  animal: TLivestock;
  handleDeleteConfirmation: (id: string) => void;
}) => {
  const t = useTranslations("animalScreen.main");
  const { formatCurrency } = useUserCurrency();

  return (
    <div
      key={animal.id}
      className="flex flex-col border border-gray-400 bgcards shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all mb-5"
    >
      {/* Animal Identification */}
      <div className="flex gap-[1rem] items-start w-full border-b mb-4 pb-2">
        <div className="text-xl font-semibold text-center   border-gray-400 flex-1">
          {t("identification")}: {animal.identification}
        </div>
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering animal edit when clicking on Delete
              handleDeleteConfirmation(animal.id); // Open delete confirmation modal
            }}
            className="w-10 h-10 p-0 bg-red-500 text-white rounded-full flex justify-center items-center"
          >
            <TrashIcon className="w-6 h-6" /> {/* Heroicons trashcan icon */}
          </Button>
        </div>
      </div>

      {/* Animal Image and Info (Species & Milkings) */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 relative">
          <Image
            src={
              animal.pictureUrl ||
              (animal.sex === ""
                ? "/images/livestock/gender.jpg"
                : animal.sex === "female"
                ? "/images/livestock/mama.png"
                : "/images/livestock/papa.png")
            } // Use animal pictureUrl or fallback to father.png
            alt="Animal"
            className="w-25 h-25 border-2 border-gray-300 object-cover"
            // fill
            width={100}
            height={100}
          />
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">
              {t("gender")}: {animal.sex}
            </p>
            <p className="text-sm text-gray-500">
              {t("income")}:{" "}
              <span className="text-green-500">
                {formatCurrency({
                  number: animal.totalIncome,
                })}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              {t("cost")}:{" "}
              <span className="text-red-500">
                {formatCurrency({
                  number: animal.totalCost,
                })}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Profit/Loss Info */}
      <div className="w-full">
        <p className="text-xl font-bold text-right">
          {t("profitAndLoss")}:{" "}
          {formatCurrency({
            number: animal.totalProfit,
          })}
        </p>
      </div>
      {animal.note != "" ? (
        <div className="w-full mt-4">
          <p className="text-sm text-gray-500 font-semibold">{t("notes")}: </p>
          <pre className="text-sm text-gray-500 text-wrap border border-gray-300 p-2">
            {animal.note}
          </pre>
        </div>
      ) : (
        ""
      )}

      <div className="space-y-2">
        <Link href={PATH_URLS.EDIT_ANIMAL(animal.id)}>
          <Button className="w-full mt-4 py-2 text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white transition-all">
            {t("editAnimalButton")}
          </Button>
        </Link>
        {/* <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering animal edit when clicking on Delete
            handleDeleteConfirmation(animal.id); // Open delete confirmation modal
          }}
          className="w-10 h-10 p-0 bg-red-500 text-white rounded-full flex justify-center items-center"
        >
          {t("deleteAnimal.confirmTitle")}
          <TrashIcon className="w-6 h-6" /> 
        </Button> */}
      </div>
    </div>
  );
};
