import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { useGetEducations } from "@/app/apiClient/hooks";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { educationController } from "@/server/controllers/education.controller";
import { TEducation } from "@/server/services/education.service";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export const EducationCard = ({
  video,
  canEdit,
  refetch,
}: {
  video: TEducation;
  canEdit?: boolean;
  refetch?: () => void;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const t = useTranslations("educationScreen.educationCard");

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await educationController.deleteEducation({ id: video.id });
      showToast({
        type: "success",
        message: "Video deleted successfully",
      });
      refetch?.();
    } catch (error) {
      showToast({
        type: "error",
        message: "Failed to delete video",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      key={video.videoUrl}
      className="p-4 bgcards rounded-lg shadow-md cursor-pointer hover:bg-gray-100 mb-8"
    >
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{video.title}</h3>
        <p className="text-sm text-gray-600">{video.description}</p>
        <Link href={video.videoUrl}>
          <Button variant="default" className="w-full mt-4">
            {t("watchNow")}
          </Button>
        </Link>
        {canEdit ? (
          <>
            <Link href={PATH_URLS.ADMIN_EDIT_EDUCATION(video.id)}>
              <Button variant="outline" className="w-full mt-2">
                Edit
              </Button>
            </Link>
            <Button
              onClick={handleDelete}
              variant="destructive"
              loading={isDeleting}
              className="w-full mt-2"
            >
              Delete
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
};
