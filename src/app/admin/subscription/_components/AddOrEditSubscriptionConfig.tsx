"use client";
import { PATH_URLS } from "@/app/apiClient/apiRoute";

import {
  useGetSubscriptionConfigById,
  usePaginatedSubscriptionsConfigs,
} from "@/app/apiClient/hooks/useGetSubscriptionConfigs";
import { addOrEditSubscriptionConfigValidation } from "@/app/utils/validations";
import { AppLayout } from "@/components/layout/AppLayout";
import { MFormInput } from "@/components/reusables/FormInput";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { subscriptionConfigController } from "@/server/controllers/subscription-config.controller";
import { TSubscriptionConfig } from "@/server/services/subscription-config.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/dist/client/components/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const AddOrEditSubscriptionConfig = ({
  isEdit,
  initialData,
}: {
  isEdit?: boolean;
  initialData?: TSubscriptionConfig;
}) => {
  const formHandler = useForm({
    resolver: yupResolver(addOrEditSubscriptionConfigValidation),
    defaultValues: {
      amount: 0,
      trialPeriod: 0,
    },
  });
  const router = useRouter();
  const { id } = useParams();

  const editSubscriptionConfigQuery = useGetSubscriptionConfigById({
    id: id as string,
  });
  const { refetch } = usePaginatedSubscriptionsConfigs();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddSubmit = async (data: TSubscriptionConfig) => {
    setLoading(true);

    try {
      subscriptionConfigController.addSubscriptionConfig(data);
      setLoading(false);
      formHandler.reset();
      refetch();
      showToast({
        message: "Subscription config added successfully",
        type: "success",
      });
      router.push(PATH_URLS.ADMIN_SUBSCRIPTION);
    } catch (error) {
      setErrorMessage("Error adding subscription config");
      setLoading(false);
    }
  };

  const handleEditSubmit = async (data: TSubscriptionConfig) => {
    setLoading(true);

    try {
      subscriptionConfigController.addSubscriptionConfig(data);
      setLoading(false);
      showToast({
        message: "Subscription config updated successfully",
        type: "success",
      });
      refetch();
      router.push(PATH_URLS.ADMIN_SUBSCRIPTION);
    } catch (error) {
      setErrorMessage("Error updating education video");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit && editSubscriptionConfigQuery.data) {
      formHandler.reset(editSubscriptionConfigQuery.data); // Populate form with existing alert data
    }
  }, [isEdit, editSubscriptionConfigQuery.data]);

  return (
    <AppLayout hasLanguageSwitcher={false} hasBottomBack className="p-6">
      <header className="text-3xl font-bold my-4 text-center">
        <h1>{isEdit ? "+ Edit" : "+ Add"} Subscription</h1>
      </header>

      <form
        onSubmit={formHandler.handleSubmit(
          isEdit ? handleEditSubmit : (handleAddSubmit as any)
        )}
      >
        <MFormInput
          formHandler={formHandler}
          label="Amount"
          name="amount"
          placeholder="Enter amount"
          type="number"
        />
        <MFormInput
          formHandler={formHandler}
          label="Trial Period (in days)"
          name="trialPeriod"
          placeholder="Enter trial period"
          type="number"
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
