"use client";

import { AppLoader } from "@/components/reusables/AppLoader";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGetPaginatedEducation } from "@/app/apiClient/hooks";
import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { EducationCard } from "@/app/admin/education/_components/EducationCard";
import { useTranslations } from "next-intl";
import { LoadMoreButton } from "@/components/reusables/LoadMoreButton";

export const EducationPageClient = () => {
  const {
    items: educations = [],
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPaginatedEducation();
  const t = useTranslations("educationScreen.main");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <AppLayout
        hasPartialLogo
        hasLanguageSwitcher={false}
        hasBottomBack
        backTo={PATH_URLS.HOME_SCREEN}
        className="p-4 md:p-6 w-full"
      >
        <header className="text-3xl font-bold my-4 text-center">
          <h1>{t("educationTitle")}</h1>
        </header>

        <div className="w-full border-b border-black mb-5"></div>

        <AppLoader isLoading={isLoading} loadingText={t("loadingResources")}>
          <div className="w-full">
            {!educations.length ? (
              <p>{t("noResourcesFound")}</p>
            ) : (
              educations.map((video) => (
                <EducationCard key={video.videoUrl} video={video} />
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
    </div>
  );
};

//  const videos = [
//     {
//       title: "Mishi ka wi li ( Chaleurs des vaches)",
//       videoUrl: "https://youtu.be/3pHvR4R7wts", // Replace with actual YouTube video ID
//       thumbnailUrl: "https://img.youtube.com/vi/3pHvR4R7wts/0.jpg",
//       description: "",
//     },
//     {
//       title: "DJI ni Nono (Eau et Lait)",
//       videoUrl: "https://youtube.com/shorts/dFuCkKrxrDU", // Replace with actual YouTube video ID
//       thumbnailUrl: "https://img.youtube.com/vi/dFuCkKrxrDU/0.jpg",
//       description: "",
//     },
//     {
//       title: "OGM Bambara",
//       videoUrl: "https://youtu.be/uVg1bmBFDTY", // Replace with actual YouTube video ID
//       thumbnailUrl: "https://img.youtube.com/vi/uVg1bmBFDTY/0.jpg",
//       description:
//         "Learn the basics of farm management in this introductory video.",
//     },
//     {
//       title: "Soil Sampling",
//       videoUrl: "https://youtu.be/c4I3VBUmyZ8", // Replace with actual YouTube video ID
//       thumbnailUrl: "https://img.youtube.com/vi/c4I3VBUmyZ8/0.jpg",
//       description: "How to take soil samples.",
//     },
//     {
//       title: "GMO Video 2",
//       videoUrl: "https://youtu.be/7--aPNy9F1Q", // Replace with actual YouTube video ID
//       thumbnailUrl: "https://img.youtube.com/vi/7--aPNy9F1Q/0.jpg",
//       description: "GMO pluses and minuses!",
//     },
//     {
//       title: "Silage@gamoutube",
//       videoUrl: "https://youtu.be/J4mFcwJedIY", // Replace with actual YouTube video ID
//       thumbnailUrl: "https://img.youtube.com/vi/J4mFcwJedIY/0.jpg",
//       description:
//         "When to harvest corn silage Quand recolter l'ensilage de Mais.",
//     },
//     {
//       title: "March 15, 2025",
//       videoUrl: "https://youtu.be/e6ebGKmjfD8", // Replace with actual YouTube video ID
//       thumbnailUrl: "https://img.youtube.com/vi/e6ebGKmjfD8/0.jpg",
//       description: "Silage harv, transport and storing.",
//     },
//   ];
