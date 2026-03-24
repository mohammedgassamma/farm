"use client";
import { auth } from "@/firebase";   // adjust path if needed
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import BackButton from "@/components/back-button";
import { useForm } from "react-hook-form";
import { MFormInput } from "@/components/reusables/FormInput";
import { addLivestockValidation } from "@/app/utils/validations";
import { TLivestock } from "@/server/services/livestock.service";
import { showToast } from "@/lib/toast";
import { livestockController } from "@/server/controllers/livestock.controller";
import { useGetLivestockById, useGetLivestocks } from "@/app/apiClient/hooks";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { uploadImage } from "@/lib/utils";

// Define the animal data type

export default function AddOrEditLivestock({
  isEdit,
  initialData,
}: {
  isEdit?: boolean;
  initialData?: TLivestock;
}) {
  const t = useTranslations("animalScreen.addOrEdit");
  const router = useRouter();
  const { id } = useParams();
  const isEditForm = Boolean(id) && isEdit;
  const user = auth.currentUser;   // ← ADD THIS

  const editLivestockQuery = useGetLivestockById({
    id: id as string,
    initialData,
  });
  const { refetch } = useGetLivestocks();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const formHandler = useForm<TLivestock>({
    resolver: yupResolver(addLivestockValidation as any),
    defaultValues: {
      //   pictureUrl: "",
      //   identification: "11",
      //   dateOfDate: "2025-12-12",
      sex: "male",
      // sex: "male",
      //   father: "zebu",
      //   mother: "dafa",
      //   inseminationCost: 0,
      //   inseminationDate: "",
      //   breedingCost: 17500,
      //   breedingDate: "2025-12-12",
      //   lastBirthDate: "2025-12-12",
      //   totalMilkProduced: 20,
      //   feedCost: 20,
      //   vetCost: 20,
      //   otherCosts: 20,
      //   amountOfMeat: 20,
      //   milkPricePerGallon: 20,
      //   meatPricePerPound: 20,
      //   totalCost: 0,
      //   totalIncome: 0,
      //   totalProfit: 0,
      //   note: "afafa",
    },
  });

  // Fetch animal data if editing
  useEffect(() => {
    if (isEditForm && id) {
      if (isEditForm && editLivestockQuery.data) {
        formHandler.reset(editLivestockQuery.data); // Populate form with existing crop data
      }
    }
  }, [isEditForm, editLivestockQuery.data]);

  // Watch specific fields for calculation
  const feedCost = formHandler.watch("feedCost");
  const vetCost = formHandler.watch("vetCost");
  const animalCost = formHandler.watch("animalCost");
  const otherCosts = formHandler.watch("otherCosts");
  const salePrice = formHandler.watch("salePrice");
  const inseminationCost = formHandler.watch("inseminationCost");
  const sex = formHandler.watch("sex");
  const pictureUrl = formHandler.watch("pictureUrl");

  const totalMilkProduced = formHandler.watch("totalMilkProduced");
  const totalIncomeMilkPricePerGallon = formHandler.watch("milkPricePerGallon");

  const isMale = sex === "male";
  const isFemale = sex === "female";

  const femaleTotalCost =
    (Number(feedCost) || 0) +
    (Number(vetCost) || 0) +
    (Number(otherCosts) || 0) +
    (Number(inseminationCost) || 0);

  const maleTotalCost =
    (Number(animalCost) || 0) +
    (Number(feedCost) || 0) +
    (Number(vetCost) || 0) +
    (Number(otherCosts) || 0);

  const femaleIncome =
    Number(Number(totalMilkProduced) || 0) *
    Number(totalIncomeMilkPricePerGallon || 0);

  const maleIncome = Number(salePrice) || 0;

  const totalCost = isFemale ? femaleTotalCost : maleTotalCost;
  const totalIncome = isFemale ? femaleIncome : maleIncome;

  const totalProfit = totalIncome - totalCost;

  const handleAddSubmit = async (data: TLivestock) => {
    setLoading(true);
    setErrorMessage("");

    if (!data.identification) {
      setErrorMessage("Please fill in all the required fields.");
      setLoading(false);
      return;
    }

    try {
      let pictureUrl = data.pictureUrl;
      if (pictureUrl) {
        const image = await uploadImage({ imageUrl: pictureUrl });

        if (image) {
          pictureUrl = image;
        } else {
          setErrorMessage("Error uploading image.");
          setLoading(false);
          return;
        }
      }

      const submitData = {
        ...data,
        pictureUrl: pictureUrl || "",
        totalCost,
        totalIncome,
        totalProfit,
         email: user?.email,   // identifies which user owns this animal
  userId: user?.uid, 
        year: new Date().getFullYear(),   // creation year
  lastEdited: Date.now(),           // timestamp of creation
};
 // recommended for security rules
      };

      livestockController.addLivestock({
        payload: submitData,
      });
      showToast({
        message: "Livestock data added successfully",
        type: "success",
      });
      refetch();
      router.push("/livestock");
    } catch (error) {
      showToast({ message: "Error adding livestock data", type: "error" });
      setErrorMessage("Error adding livestock data");
      setLoading(false);
    }
  };

  const handleEditSubmit = async (data: TLivestock) => {
    setLoading(true);
    setErrorMessage("");

    try {
      let pictureUrl = data?.pictureUrl || "";
      if (pictureUrl) {
        const formData = new FormData();
        formData.append("image", pictureUrl);

        const response = await fetch(
          "https://api.imgbb.com/1/upload?key=616684de02b5558ef7bbb0652ad55ba0",
          {
            method: "POST",
            body: formData,
          }
        );

        const imageData = await response.json();
        if (imageData.success) {
          pictureUrl = imageData.data.url;
        } else {
          setErrorMessage("Error uploading image.");
          setLoading(false);
          return;
        }
      }

      const submitData = {
        ...data,
        pictureUrl,
        totalCost,
        totalIncome,
        totalProfit,
      };

      livestockController.editLivestock({
        id: data.id,
        payload: submitData,
      });
      showToast({
        message: "Livestock data updated successfully",
        type: "success",
      });
      refetch();
      editLivestockQuery.refetch();

      router.push("/livestock");
    } catch (error) {
      setErrorMessage("Error updating livestock data");
      showToast({ message: "Error updating livestock data", type: "error" });
      setLoading(false);
    }
  };

  return (
    <AppLayout hasLanguageSwitcher={false} hasBottomBack className="p-6">
      <header className="text-3xl font-bold my-4 text-center">
        <h1>{isEditForm ? t("editTitle") : t("addTitle")}</h1>
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
          label={t("pictureUrl.label")}
          name="pictureUrl"
          placeholder={t("pictureUrl.placeholder")}
          imageClassName="w-25 h-25 bg-white rounded-sm"
          image="/images/camera-icon-21.png"
          type="file"
          accept="image/*"
          value={pictureUrl}
        />
        <MFormInput
          formHandler={formHandler}
          label={t("identification.label")}
          name="identification"
          placeholder={t("identification.placeholder")}
          image="/images/livestock/ident.png"
        />

        <MFormInput
          formHandler={formHandler}
          label={t("dateOfBirth.label")}
          name="dateOfBirth"
          type="date"
          image="/images/livestock/date_of_birth.png"
          className="w-full"
        />

        {/* Sex Radio Buttons */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2">
              {t("gender.label")}
            </label>

            <div className="flex  flex-col">
              <MFormInput
                formHandler={formHandler}
                label={t("male.label")}
                name="sex"
                type="radio"
                value={"male"}
                image="/images/livestock/male.png"
              />
              <MFormInput
                formHandler={formHandler}
                label={t("female.label")}
                name="sex"
                type="radio"
                value={"female"}
                image="/images/livestock/female.png"
              />
            </div>
          </div>
        </div>

        {/* Conditional fields based on sex selection */}
        {(isMale || isFemale) && (
          <>
            <MFormInput
              formHandler={formHandler}
              label={t("father.label")}
              name="father"
              placeholder={t("father.placeholder")}
              image="/images/livestock/papa.png"
            />

            <MFormInput
              formHandler={formHandler}
              label={t("mother.label")}
              name="mother"
              placeholder={t("mother.placeholder")}
              image="/images/livestock/mama.png"
            />

            {isMale ? (
              <MFormInput
                formHandler={formHandler}
                label={t("animalCost.label")}
                name="animalCost"
                type="number"
                placeholder={t("animalCost.placeholder")}
                image="/images/livestock/animalCost3.png"
                imageClassName="w-50 h-25"
              />
            ) : null}
            <MFormInput
              formHandler={formHandler}
              label={t("feedCost.label")}
              name="feedCost"
              type="number"
              placeholder={t("feedCost.placeholder")}
              image="/images/livestock/feedcost.jpg"
              imageClassName="w-50 h-25"
            />

            <MFormInput
              formHandler={formHandler}
              label={t("vetCost.label")}
              name="vetCost"
              type="number"
              placeholder={t("vetCost.placeholder")}
              image="/images/livestock/vetcost.jpg"
              imageClassName="w-50 h-25"
            />

            <MFormInput
              formHandler={formHandler}
              label={t("otherCosts.label")}
              name="otherCosts"
              type="number"
              placeholder={t("otherCosts.placeholder")}
              image="/images/livestock/othercosts.jpg"
              imageClassName="w-50 h-25"
            />
          </>
        )}

        {isMale ? (
          <>
            <MFormInput
              formHandler={formHandler}
              label={t("salePrice.label")}
              name="salePrice"
              type="number"
              placeholder={t("salePrice.placeholder")}
              image="/images/livestock/animalcost2.png"
              imageClassName="w-50 h-25"
            />
          </>
        ) : null}

        {isFemale && (
          <>
            <MFormInput
              formHandler={formHandler}
              label={t("inseminationCost.label")}
              name="inseminationCost"
              type="number"
              placeholder={t("inseminationCost.placeholder")}
              image="/images/livestock/aicost.jpg"
              imageClassName="w-50 h-25"
            />

            <MFormInput
              formHandler={formHandler}
              label={t("inseminationDate.label")}
              name="inseminationDate"
              type="date"
              image="/images/livestock/aidate.jpg"
              imageClassName="w-50 h-25"
            />

            {/* <MFormInput
                  formHandler={formHandler}
                  label="Breeding Cost"
                  name="breedingCost"
                  type="number"
                  placeholder=""
                  image="/images/livestock/breeding_cost.jpg"
                  imageClassName="w-50 h-25"
                /> */}

            <MFormInput
              formHandler={formHandler}
              label={t("breedingDate.label")}
              name="breedingDate"
              type="date"
              image="/images/livestock/breeding_date_2.png"
              imageClassName="!w-50 !h-26 "
            />

            <MFormInput
              formHandler={formHandler}
              label={t("calvingDate.label")}
              name="lastBirthDate"
              type="date"
              image="/images/livestock/calvingday.jpg"
              imageClassName="w-50 h-25"
            />

            <MFormInput
              formHandler={formHandler}
              label={t("totalMilkProduced.label")}
              name="totalMilkProduced"
              type="number"
              placeholder={t("totalMilkProduced.placeholder")}
              image="/images/livestock/milktodate.jpg"
              imageClassName="w-50 h-25"
            />

            <MFormInput
              formHandler={formHandler}
              label={t("milkPricePerGallon.label")}
              name="milkPricePerGallon"
              type="number"
              placeholder={t("milkPricePerGallon.placeholder")}
              image="/images/livestock/milkprice.jpg"
              imageClassName="w-50 h-25"
            />
          </>
        )}

        {/* Calculated Fields */}
        <MFormInput
          formHandler={formHandler}
          label={t("totalCost.label")}
          name="totalCost"
          image="/images/livestock/totalexpenses.jpg"
          imageClassName="w-50 h-25"
          value={totalCost.toFixed(2)}
          readOnly={true}
          type="text"
        />

        <MFormInput
          formHandler={formHandler}
          label={t("totalIncome.label")}
          name="totalIncome"
          image="/images/livestock/totalincome.jpg"
          imageClassName="w-50 h-25"
          value={totalIncome.toFixed(2)}
          readOnly={true}
          type="text"
        />

        <MFormInput
          formHandler={formHandler}
          label={t("totalProfit.label")}
          name="totalProfit"
          image="/images/livestock/totalprofit.jpg"
          imageClassName="w-50 h-25"
          value={totalProfit.toFixed(2)}
          readOnly={true}
          type="text"
        />

        {/* Notes */}
        <MFormInput
          formHandler={formHandler}
          label={t("notes.label")}
          name="note"
          placeholder={t("notes.placeholder")}
          image="/images/crops/reminder.png"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          className="w-full p-3  text-white rounded-md "
          disabled={loading}
        >
          {loading ? t("loadingButton") : t("saveButton")}
        </Button>
      </form>

      {errorMessage && (
        <p className="text-red-500 text-center mt-4">{errorMessage}</p>
      )}
    </AppLayout>
  );
}
