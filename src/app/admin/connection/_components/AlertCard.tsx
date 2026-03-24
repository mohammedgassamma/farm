import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { convertDateFromTimestamp } from "@/lib/utils";
import { alertController } from "@/server/controllers/alert.controller";
import { TAlert } from "@/server/services/alert.service";
import Link from "next/link";
import React, { useState } from "react";
import { getAlertTypeClass } from "./constants";

export const AlertCard = ({
  alert,
  canEdit,
  refetch,
}: {
  alert: TAlert;

  canEdit?: boolean;
  refetch?: () => void;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await alertController.deleteAlert({ id: alert.id });
      showToast({
        type: "success",
        message: "Alert deleted successfully",
      });
      refetch?.();
    } catch (error) {
      showToast({
        type: "error",
        message: "Failed to delete alert",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 bgcards shadow-lg rounded-md border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div
          className={`w-10 h-10 rounded-full ${getAlertTypeClass({
            type: alert.type,
          })}`}
        ></div>
        <span className="text-sm text-gray-500">
          {convertDateFromTimestamp(alert.createdAt)}
        </span>
      </div>
      <h3 className="text-lg font-semibold">{alert.title}</h3>
      <p>{alert.message}</p>
      {canEdit ? (
        <>
          <Link href={PATH_URLS.ADMIN_EDIT_ALERT(alert.id)}>
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
  );
};
