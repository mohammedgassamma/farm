"use client";
import { PATH_URLS } from "@/app/apiClient/apiRoute";
import {
  useGetProductById,
  useGetProducts,
} from "@/app/apiClient/hooks/useGetProducts";
import {
  addOrEditEducationValidation,
  addOrEditProductValidation,
} from "@/app/utils/validations";
import { AppLayout } from "@/components/layout/AppLayout";
import { MFormInput } from "@/components/reusables/FormInput";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { generateCode, uploadImage } from "@/lib/utils";
import { productController } from "@/server/controllers/product.controller";
import { TProduct } from "@/server/services/product.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/dist/client/components/navigation";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const AddOrEditProduct = ({
  isEdit,
  initialData,
}: {
  isEdit?: boolean;
  initialData?: TProduct;
}) => {
  const formHandler = useForm({
    resolver: yupResolver(addOrEditProductValidation),
    defaultValues: {},
  });
  const router = useRouter();
  const { id } = useParams();
  const imageURL = formHandler.watch<any>("imageURL");

  const editProductQuery = useGetProductById({
    id: id as string,
  });

  const { refetch } = useGetProducts();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddSubmit = async (data: TProduct) => {
    setLoading(true);

    try {
      const image = await uploadImage({ imageUrl: data.imageURL });
      if (!image) {
        setErrorMessage("Thumbnail upload failed");
        setLoading(false);
        return;
      }

      productController.addProduct({
        payload: {
          ...data,
          imageURL: image || "",
          sku: generateCode({ length: 8 }),
          price: Number(data.price),
          quantity: Number(data.quantity),
          currency: "USD",
        },
      });

      setLoading(false);
      // Reset the form after successful submission
      formHandler.reset();
      refetch();
      showToast({
        message: "Product added successfully",
        type: "success",
      });
      router.push(PATH_URLS.ADMIN_STORE);
    } catch (error) {
      setErrorMessage("Error adding product");
      setLoading(false);
    }
  };

  const handleEditSubmit = async (data: TProduct) => {
    setLoading(true);

    try {
      const image = await uploadImage({ imageUrl: data.imageURL });

      if (!image) {
        setErrorMessage("Thumbnail upload failed");
        setLoading(false);
        return;
      }

      productController.editProduct({
        id: data.id,
        payload: {
          ...data,
          imageURL: image || "",
          price: Number(data.price),
          quantity: Number(data.quantity),
        },
      });
      setLoading(false);
      showToast({
        message: "Product updated successfully",
        type: "success",
      });
      refetch();
      editProductQuery.refetch();
      router.push(PATH_URLS.ADMIN_STORE);
    } catch (error) {
      setErrorMessage("Error updating product");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit && editProductQuery.data) {
      formHandler.reset(editProductQuery.data); // Populate form with existing product data
    }
  }, [isEdit, editProductQuery.data]);

  return (
    <AppLayout hasLanguageSwitcher={false} hasBottomBack className="p-6">
      <header className="text-3xl font-bold my-4 text-center">
        <h1>{isEdit ? "+ Edit" : "+ Add"} Product</h1>
      </header>

      <form
        onSubmit={formHandler.handleSubmit(
          isEdit ? handleEditSubmit : (handleAddSubmit as any)
        )}
      >
        <MFormInput
          formHandler={formHandler}
          label="Name"
          name="name"
          placeholder="Enter name"
        />
        <MFormInput
          formHandler={formHandler}
          label="Description"
          name="description"
          placeholder="Enter description"
        />
        <MFormInput
          formHandler={formHandler}
          label="Image URL"
          name="imageURL"
          placeholder="Enter image URL"
          type="file"
          accept="image/*"
          imageClassName="w-25 h-25 bg-white rounded-sm"
          image="/images/camera-icon-21.png"
          value={imageURL}
        />
        <MFormInput
          formHandler={formHandler}
          label={"Price"}
          name="price"
          type="number"
          placeholder="Enter price"
        />
        <MFormInput
          formHandler={formHandler}
          label="Quantity"
          name="quantity"
          type="number"
          placeholder="Enter quantity"
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
