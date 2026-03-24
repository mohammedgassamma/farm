"use client";
import { PATH_URLS } from "@/app/apiClient/apiRoute";
import { useGetEducationById, useGetEducations } from "@/app/apiClient/hooks";
import { addOrEditEducationValidation } from "@/app/utils/validations";
import { AppLayout } from "@/components/layout/AppLayout";
import { MFormInput } from "@/components/reusables/FormInput";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { uploadImage } from "@/lib/utils";
import { educationController } from "@/server/controllers/education.controller";
import { TEducation } from "@/server/services/education.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/dist/client/components/navigation";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const AddOrEditEducation = ({
  isEdit,
  initialData,
}: {
  isEdit?: boolean;
  initialData?: TEducation;
}) => {
  const formHandler = useForm({
    resolver: yupResolver(addOrEditEducationValidation),
    defaultValues: {},
  });
  const router = useRouter();
  const { id } = useParams();
  const thumbnailUrl = formHandler.watch<any>("thumbnailUrl");

  const editEducationQuery = useGetEducationById({
    id: id as string,
  });
  const { refetch } = useGetEducations();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddSubmit = async (data: TEducation) => {
    setLoading(true);

    try {
      const image = await uploadImage({ imageUrl: data.thumbnailUrl });

      if (!image) {
        setErrorMessage("Thumbnail upload failed");
        setLoading(false);
        return;
      }

      educationController.addEducation({
        payload: { ...data, thumbnailUrl: image || "" },
      });
      setLoading(false);
      // Reset the form after successful submission
      formHandler.reset();
      refetch();
      showToast({
        message: "Education video added successfully",
        type: "success",
      });
      router.push(PATH_URLS.ADMIN_EDUCATION);
    } catch (error) {
      setErrorMessage("Error adding education video");
      setLoading(false);
    }
  };

  const handleEditSubmit = async (data: TEducation) => {
    setLoading(true);

    try {
      const image = await uploadImage({ imageUrl: data.thumbnailUrl });

      if (!image) {
        setErrorMessage("Thumbnail upload failed");
        setLoading(false);
        return;
      }

      educationController.editEducation({
        id: data.id,
        payload: { ...data, thumbnailUrl: image || "" },
      });
      setLoading(false);
      showToast({
        message: "Education video updated successfully",
        type: "success",
      });
      refetch();
      editEducationQuery.refetch();
      router.push(PATH_URLS.ADMIN_EDUCATION);
    } catch (error) {
      setErrorMessage("Error updating education video");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit && editEducationQuery.data) {
      formHandler.reset(editEducationQuery.data); // Populate form with existing education data
    }
  }, [isEdit, editEducationQuery.data]);

  return (
    <AppLayout hasLanguageSwitcher={false} hasBottomBack className="p-6">
      <header className="text-3xl font-bold my-4 text-center">
        <h1>{isEdit ? "+ Edit" : "+ Add"} Education Video</h1>
      </header>

      <form
        onSubmit={formHandler.handleSubmit(
          isEdit ? handleEditSubmit : (handleAddSubmit as any)
        )}
      >
        <MFormInput
          formHandler={formHandler}
          label="Title"
          name="title"
          placeholder="Enter title"
        />
        <MFormInput
          formHandler={formHandler}
          label="Video URL"
          name="videoUrl"
          placeholder="Enter video URL"
        />
        <MFormInput
          formHandler={formHandler}
          label="Thumbnail URL"
          name="thumbnailUrl"
          placeholder="Enter thumbnail URL"
          type="file"
          accept="image/*"
          imageClassName="w-25 h-25 bg-white rounded-sm"
          image="/images/camera-icon-21.png"
          value={thumbnailUrl}
        />
        <MFormInput
          formHandler={formHandler}
          label="Description"
          name="description"
          placeholder="Enter description"
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
