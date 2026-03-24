"use client";
import { PATH_URLS } from "@/app/apiClient/apiRoute";
import {
  useGetAlertById,
  useGetAlerts,
} from "@/app/apiClient/hooks/useGetAlert";
import { addOrEditAlertValidation } from "@/app/utils/validations";
import { AppLayout } from "@/components/layout/AppLayout";
import { MFormInput } from "@/components/reusables/FormInput";
import { MFormSelect } from "@/components/reusables/MFormSelect";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { alertController } from "@/server/controllers/alert.controller";
import { TAlert } from "@/server/services/alert.service";
import { TEducation } from "@/server/services/education.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/dist/client/components/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ALERT_TYPE_OPTIONS } from "./constants";

export const AddOrEditAlert = ({
  isEdit,
  initialData,
}: {
  isEdit?: boolean;
  initialData?: TEducation;
}) => {
  const formHandler = useForm({
    resolver: yupResolver(addOrEditAlertValidation),
    defaultValues: {
      type: "system",
    },
  });
  const router = useRouter();
  const { id } = useParams();

  const editAlertQuery = useGetAlertById({
    id: id as string,
  });
  const { refetch } = useGetAlerts();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddSubmit = async (data: TAlert) => {
    setLoading(true);

    try {
      alertController.addAlert({
        payload: data,
      });
      setLoading(false);
      // Reset the form after successful submission
      formHandler.reset();
      refetch();
      showToast({
        message: "Alert added successfully",
        type: "success",
      });
      router.push(PATH_URLS.ADMIN_ALERTS);
    } catch (error) {
      setErrorMessage("Error adding alert");
      setLoading(false);
    }
  };

  const handleEditSubmit = async (data: TAlert) => {
    setLoading(true);

    try {
      alertController.editAlert({
        id: data.id,
        payload: { ...data },
      });
      setLoading(false);
      showToast({
        message: "Alert updated successfully",
        type: "success",
      });
      refetch();
      editAlertQuery.refetch();
      router.push(PATH_URLS.ADMIN_ALERTS);
    } catch (error) {
      setErrorMessage("Error updating education video");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit && editAlertQuery.data) {
      formHandler.reset(editAlertQuery.data); // Populate form with existing alert data
    }
  }, [isEdit, editAlertQuery.data]);

  return (
    <AppLayout hasLanguageSwitcher={false} hasBottomBack className="p-6">
      <header className="text-3xl font-bold my-4 text-center">
        <h1>{isEdit ? "+ Edit" : "+ Add"} Alert</h1>
      </header>

      <form
        onSubmit={formHandler.handleSubmit(
          isEdit ? handleEditSubmit : (handleAddSubmit as any)
        )}
      >
        <MFormSelect
          label="Type"
          name="type"
          placeholder="Enter type"
          formHandler={formHandler}
          options={ALERT_TYPE_OPTIONS}
        />

        <MFormInput
          formHandler={formHandler}
          label="Title"
          name="title"
          placeholder="Enter title"
        />
        <MFormInput
          formHandler={formHandler}
          label="Message"
          name="message"
          placeholder="Enter message"
        />

        {/* Submit Button */}
        <Button
          loading={loading}
          loadingText={"Saving..."}
          type="submit"
          variant="default"
          className="w-full p-3  text-white rounded-md "
        >
          {isEdit ? "Update" : "Save"}
        </Button>
      </form>

      {errorMessage && (
        <p className="text-red-500 text-center mt-4">{errorMessage}</p>
      )}
    </AppLayout>
  );
};
