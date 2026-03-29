"use client";
import { authFirebase as auth } from "@/firebaseAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { addCropValidation } from "@/app/utils/validations";
import { MFormInput } from "@/components/reusables/FormInput";
import { TCrop } from "@/server/services/crop.service";
import { cropController } from "@/server/controllers/crop.controller";
import { showToast } from "@/lib/toast";
import { useGetCropById, usePaginatedCrops } from "@/app/apiClient/hooks";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { parseNumericString } from "@/lib/utils";

export default function AddOrEditCrops({
                                         isEdit,
                                         initialData,
                                       }: {
  isEdit?: boolean;
  initialData?: TCrop;
}) {
  const t = useTranslations("agricultureScreen.addOrEdit");
  const router = useRouter();
  const { id } = useParams();
  const isEditForm = Boolean(id) && isEdit;
  const user = auth.currentUser;
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const editCropQuery = useGetCropById({ id: id as string, initialData });

  const formHandler = useForm({
    resolver: yupResolver(addCropValidation),
    defaultValues: {},
  });

  useEffect(() => {
    if (isEditForm && editCropQuery.data) {
      formHandler.reset(editCropQuery.data);
    }
  }, [isEditForm, editCropQuery.data]);

  const { refetch } = usePaginatedCrops();

  const area = formHandler.watch("area");
  const seedCostPerHa = formHandler.watch("seedCostPerHa");
  const fertilizerCostPerHa = formHandler.watch("fertilizerCostPerHa");
  const herbicideCostPerHa = formHandler.watch("herbicideCostPerHa");
  const laborCostPerHa = formHandler.watch("laborCostPerHa");
  const otherCostsPerHa = formHandler.watch("otherCostsPerHa");
  const yieldKgPerHa = formHandler.watch("yieldKgPerHa");
  const pricePerKg = formHandler.watch("pricePerKg");

  const cleanedArea = parseNumericString(area?.toString() || "0");

  const expensesPerField =
      ((Number(seedCostPerHa) || 0) +
          (Number(fertilizerCostPerHa) || 0) +
          (Number(herbicideCostPerHa) || 0) +
          (Number(laborCostPerHa) || 0) +
          (Number(otherCostsPerHa) || 0)) *
      (Number(cleanedArea) || 1);

  const revenuesPerField =
      (Number(yieldKgPerHa) || 0) *
      (Number(cleanedArea) || 0) *
      (Number(pricePerKg) || 0);

  const profits = revenuesPerField - expensesPerField;

  const handleAddSubmit = async (data: TCrop) => {
    setLoading(true);

    try {
      const submitData = {
        ...data,
        expensesPerField,
        revenuesPerField,
        profits,
      };

      cropController.addCrop({ payload: submitData });
      showToast({ message: "Crop data added successfully", type: "success" });
      refetch();
      router.push("/crops");
    } catch (error) {
      setErrorMessage("Error adding crop data");
      setLoading(false);
    }
  };

  const handleEditSubmit = async (data: TCrop) => {
    setLoading(true);

    try {
      const submitData = {
        ...data,
        expensesPerField,
        revenuesPerField,
        profits,
        email: user?.email,
        userId: user?.uid,
        year: new Date().getFullYear(),
        lastEdited: Date.now(),
      };

      cropController.editCrop({ id: data.id, payload: submitData });
      showToast({ message: "Crop data edited successfully", type: "success" });
      refetch();
      editCropQuery.refetch();
      router.push("/crops");
    } catch (error) {
      setErrorMessage("Error adding crop data");
      setLoading(false);
    }
  };

  return (
      <>
        <AppLayout hasLanguageSwitcher={false} hasBottomBack className="p-6">
          <header className="text-3xl font-bold my-4 text-center">
            <h1>{t(isEditForm ? "editTitle" : "addTitle")}</h1>
          </header>

          <div className="w-full border-b border-black mb-5"></div>

          <form
              onSubmit={formHandler.handleSubmit(
                  isEditForm ? handleEditSubmit : (handleAddSubmit as any)
              )}
              className="space-y-4"
          >
            <MFormInput
                formHandler={formHandler}
                label={t("fieldNumber.label")}
                name="fieldNumber"
                placeholder={t("fieldNumber.placeholder")}
                image="/images/crops/field.png"
            />
            <MFormInput
                formHandler={formHandler}
                label={t("area.label")}
                name="area"
                placeholder={t("area.placeholder")}
                image="/images/crops/area.png"
            />
            <MFormInput
                formHandler={formHandler}
                label={t("cropPlanted.label")}
                name="crop"
                placeholder={t("cropPlanted.placeholder")}
                image="/images/crops/crop.png"
            />
            <MFormInput
                formHandler={formHandler}
                label={t("seedCostPerHa.label")}
                name="seedCostPerHa"
                placeholder={t("seedCostPerHa.placeholder")}
                image="/images/crops/seedcost.jpg"
                imageClassName="w-50! h-25!"
            />

            <div className="grid grid-cols-1 gap-4 mb-4">
              <MFormInput
                  formHandler={formHandler}
                  label={t("fertilizerCostPerHa.label")}
                  name="fertilizerCostPerHa"
                  placeholder={t("fertilizerCostPerHa.placeholder")}
                  image="/images/crops/fertcost.jpg"
                  imageClassName="w-50! h-25!"
              />
              <MFormInput
                  formHandler={formHandler}
                  label={t("herbicideCostPerHa.label")}
                  name="herbicideCostPerHa"
                  placeholder={t("herbicideCostPerHa.placeholder")}
                  image="/images/crops/sprayingcost.jpg"
                  imageClassName="w-50! h-25!"
              />
              <MFormInput
                  formHandler={formHandler}
                  label={t("laborCostPerHa.label")}
                  name="laborCostPerHa"
                  placeholder={t("laborCostPerHa.placeholder")}
                  image="/images/crops/laborcost.jpg"
                  imageClassName="w-50! h-25!"
              />
              <MFormInput
                  formHandler={formHandler}
                  label={t("otherCostsPerHa.label")}
                  name="otherCostsPerHa"
                  placeholder={t("otherCostsPerHa.placeholder")}
                  image="/images/crops/othercost.jpg"
                  imageClassName="w-50! h-25!"
              />
              <MFormInput
                  formHandler={formHandler}
                  label={t("yieldKgPerHa.label")}
                  name="yieldKgPerHa"
                  placeholder={t("yieldKgPerHa.placeholder")}
                  image="/images/crops/yield.png"
              />
              <MFormInput
                  formHandler={formHandler}
                  label={t("pricePerKg.label")}
                  name="pricePerKg"
                  placeholder={t("pricePerKg.placeholder")}
                  image="/images/crops/kiloprice.jpg"
                  imageClassName="w-50 h-25"
              />
            </div>

            <MFormInput
                formHandler={formHandler}
                label={t("expensesPerField.label")}
                name="expensesPerField"
                image="/images/crops/totalexpenses.jpg"
                imageClassName="w-50 h-25"
                value={expensesPerField.toFixed(2)}
                readOnly={true}
                type="number"
                placeholder={t("expensesPerField.placeholder")}
            />

            <MFormInput
                formHandler={formHandler}
                label={t("revenuesPerField.label")}
                name="revenuesPerField"
                image="/images/crops/totalincome.jpg"
                imageClassName="w-50 h-25"
                value={revenuesPerField.toFixed(2)}
                readOnly={true}
                placeholder={t("revenuesPerField.placeholder")}
                type="number"
            />

            <MFormInput
                formHandler={formHandler}
                label={t("profits.label")}
                name="profits"
                image="/images/crops/profit.jpg"
                imageClassName="w-50 h-25"
                value={profits.toFixed(2)}
                readOnly={true}
                placeholder={t("profits.placeholder")}
                type="number"
            />

            <MFormInput
                formHandler={formHandler}
                label={t("notes.label")}
                name="note"
                placeholder={t("notes.placeholder")}
                image="/images/crops/reminder.png"
            />

            <Button
                loading={loading}
                loadingText={t("loadingButton")}
                type="submit"
                variant="default"
                className="w-full p-3 text-white rounded-md"
            >
              {t("saveButton")}
            </Button>
          </form>

          {errorMessage && (
              <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
        </AppLayout>
      </>
  );
}
