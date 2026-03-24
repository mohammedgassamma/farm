"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { yupResolver } from "@hookform/resolvers/yup";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import BackButton from "@/components/back-button"; // Import the updated BackButton component
import { useForm } from "react-hook-form";
import { addCropValidation } from "@/app/utils/validations";
import z from "zod";
import { MFormInput } from "@/components/reusables/FormInput";

export default function CropsPage() {
  const router = useRouter();

  const [cropData, setCropData] = useState({
    fieldNumber: "",
    area: 0,
    crop: "",
    seedCostPerHa: 0,
    fertilizerCostPerHa: 0,
    herbicideCostPerHa: 0,
    laborCostPerHa: 0,
    otherCostsPerHa: 0,
    yieldKgPerHa: 0,
    pricePerKg: 0,
    expensesPerField: 0,
    revenuesPerField: 0,
    profits: 0,
    note: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCropData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Recalculate expenses, revenues, and profits when relevant fields change
      updatedData.expensesPerField =
        (parseFloat(String(updatedData.seedCostPerHa || 0)) || 0) *
          (parseFloat(String(updatedData.area || 0)) || 0) +
        (parseFloat(String(updatedData.fertilizerCostPerHa || 0)) || 0) *
          (parseFloat(String(updatedData.area || 0)) || 0) +
        (parseFloat(String(updatedData.herbicideCostPerHa || 0)) || 0) *
          (parseFloat(String(updatedData.area || 0)) || 0) +
        (parseFloat(String(updatedData.laborCostPerHa || 0)) || 0) *
          (parseFloat(String(updatedData.area || 0)) || 0) +
        (parseFloat(String(updatedData.otherCostsPerHa || 0)) || 0) *
          (parseFloat(String(updatedData.area || 0)) || 0);

      updatedData.revenuesPerField =
        (parseFloat(String(updatedData.yieldKgPerHa || 0)) || 0) *
        (parseFloat(String(updatedData.area || 0)) || 0) *
        (parseFloat(String(updatedData.pricePerKg || 0)) || 0);

      updatedData.profits =
        updatedData.revenuesPerField - updatedData.expensesPerField;

      return updatedData;
    });
  };

  const formHandler = useForm({
    // resolver: zodResolver(addCropValidation),
    resolver: yupResolver(addCropValidation),
    defaultValues: {},
  });

  const onSubmit = (data: any) => console.log(data);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!cropData.fieldNumber) {
      setErrorMessage("Please fill in all the required fields.");
      return;
    }

    try {
      // Add the new crop to Firestore in the 'crops' collection
      await addDoc(collection(db, "crops"), cropData);
      router.push("/crops"); // Redirect to the crops page after adding the crop
    } catch (error) {
      setErrorMessage("Error adding crop data");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="min-h-screen w-full max-w-md bg-white rounded-md shadow-md bggreen">
        <div className="sticky top-0 ml-auto">
          {/* Back Button */}
          <BackButton to="/crops" />
        </div>
        <div>
          <img src="/images/gamou-logo.png" alt="Gamou Logo" />
        </div>

        <div className="p-6">
          <header className="text-3xl font-bold my-4 text-center">
            <h1>Add a New Crop</h1>
          </header>

          <div className="w-full border-b border-black mb-5"></div>

          {/* <form onSubmit={handleSubmit} className="space-y-4"> */}
          <form
            onSubmit={formHandler.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <MFormInput
              formHandler={formHandler}
              label="Field Number"
              name="fieldNumber"
              placeholder="Field Number"
            />
            <div className="flex items-center space-x-4 mb-4">
              <img
                src="/images/crops/field.png"
                alt="Field Number"
                className="w-25 h-25"
              />
              <div className="flex-1">
                <label
                  className="block text-sm font-semibold mb-2"
                  htmlFor="fieldNumber"
                >
                  Field Number
                </label>
                <Input
                  type="text"
                  name="fieldNumber"
                  value={cropData.fieldNumber}
                  onChange={handleChange}
                  placeholder="Field Number"
                  id="fieldNumber"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <img
                src="/images/crops/area.png"
                alt="Area of Field"
                className="w-25 h-25"
              />
              <div className="flex-1">
                <label
                  className="block text-sm font-semibold mb-2"
                  htmlFor="area"
                >
                  Area, Ha
                </label>
                <Input
                  type="number"
                  name="area"
                  value={cropData.area == 0 ? "" : cropData.area}
                  onChange={handleChange}
                  placeholder=""
                  id="area"
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <img
                src="/images/crops/crop.png"
                alt="Crop Planted"
                className="w-25 h-25"
              />
              <div className="flex-1">
                <label
                  className="block text-sm font-semibold mb-2"
                  htmlFor="crop"
                  id="Seed"
                >
                  Crop Planted
                </label>
                <Input
                  type="text"
                  name="crop"
                  value={cropData.crop}
                  onChange={handleChange}
                  placeholder="Crop Planted"
                  id="crop"
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src="/images/crops/seedcost.jpg"
                  alt="Seed Cost Per Hectare"
                  className="w-50 h-25"
                />
                <div className="flex-1">
                  <label
                    className="block text-sm font-semibold mb-2"
                    htmlFor="seedCostPerHa"
                  >
                    Seed Cost/Ha
                  </label>
                  <Input
                    type="number"
                    name="seedCostPerHa"
                    value={
                      cropData.seedCostPerHa == 0 ? "" : cropData.seedCostPerHa
                    }
                    onChange={handleChange}
                    placeholder=""
                    id="seedCostPerHa"
                    className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src="/images/crops/fertcost.jpg"
                  alt="Fertilizer Cost Per Hectare"
                  className="w-50 h-25"
                />
                <div className="flex-1">
                  <label
                    className="block text-sm font-semibold mb-2"
                    htmlFor="fertilizerCostPerHa"
                  >
                    Fertilizer Cost/Ha
                  </label>
                  <Input
                    type="number"
                    name="fertilizerCostPerHa"
                    value={
                      cropData.fertilizerCostPerHa == 0
                        ? ""
                        : cropData.fertilizerCostPerHa
                    }
                    onChange={handleChange}
                    placeholder=""
                    id="fertilizerCostPerHa"
                    className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src="/images/crops/sprayingcost.jpg"
                  alt="Herbicide Cost Per Hectare"
                  className="w-50 h-25"
                />
                <div className="flex-1">
                  <label
                    className="block text-sm font-semibold mb-2"
                    htmlFor="herbicideCostPerHa"
                  >
                    Herbicide Cost/Ha
                  </label>
                  <Input
                    type="number"
                    name="herbicideCostPerHa"
                    value={
                      cropData.herbicideCostPerHa == 0
                        ? ""
                        : cropData.herbicideCostPerHa
                    }
                    onChange={handleChange}
                    placeholder=""
                    id="herbicideCostPerHa"
                    className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src="/images/crops/laborcost.jpg"
                  alt="Labor Cost"
                  className="w-50 h-25"
                />
                <div className="flex-1">
                  <label
                    className="block text-sm font-semibold mb-2"
                    htmlFor="laborCostPerHa"
                  >
                    Labor Cost/Ha
                  </label>
                  <Input
                    type="number"
                    name="laborCostPerHa"
                    value={
                      cropData.laborCostPerHa == 0
                        ? ""
                        : cropData.laborCostPerHa
                    }
                    onChange={handleChange}
                    placeholder=""
                    id="laborCostPerHa"
                    className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src="/images/crops/othercost.jpg"
                  alt="Other Costs"
                  className="w-50 h-25"
                />
                <div className="flex-1">
                  <label
                    className="block text-sm font-semibold mb-2"
                    htmlFor="otherCostsPerHa"
                  >
                    Other Costs/Ha
                  </label>
                  <Input
                    type="number"
                    name="otherCostsPerHa"
                    value={
                      cropData.otherCostsPerHa == 0
                        ? ""
                        : cropData.otherCostsPerHa
                    }
                    onChange={handleChange}
                    placeholder=""
                    id="otherCostsPerHa"
                    className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src="/images/crops/yield.png"
                  alt="Yield Kg per Hectare"
                  className="w-25 h-25"
                />
                <div className="flex-1">
                  <label
                    className="block text-sm font-semibold mb-2"
                    htmlFor="yieldKgPerHa"
                  >
                    Yield Kg/Ha
                  </label>
                  <Input
                    type="number"
                    name="yieldKgPerHa"
                    value={
                      cropData.yieldKgPerHa == 0 ? "" : cropData.yieldKgPerHa
                    }
                    onChange={handleChange}
                    placeholder=""
                    id="yieldKgPerHa"
                    className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src="/images/crops/kiloprice.jpg"
                  alt="Price per Kilo"
                  className="w-50 h-25"
                />
                <div className="flex-1">
                  <label
                    className="block text-sm font-semibold mb-2"
                    htmlFor="pricePerKg"
                  >
                    Price/Kg
                  </label>
                  <Input
                    type="number"
                    name="pricePerKg"
                    value={cropData.pricePerKg == 0 ? "" : cropData.pricePerKg}
                    onChange={handleChange}
                    placeholder=""
                    id="pricePerKg"
                    className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Expenses, Revenues, and Profits */}
            <div className="flex items-center space-x-4">
              <img
                src="/images/crops/totalexpenses.jpg"
                alt="Total Expenses"
                className="w-50 h-25"
              />
              <div className="flex-1">
                <label
                  className="block text-sm font-semibold mb-2"
                  htmlFor="expensesPerField"
                >
                  Expenses/Field <span className="invis">not ground</span>
                </label>
                <Input
                  type="text"
                  name="expensesPerField"
                  value={cropData.expensesPerField.toFixed(2)} // Display with 2 decimal points
                  readOnly
                  id="expensesPerField"
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <img
                src="/images/crops/totalincome.jpg"
                alt="Total Income"
                className="w-50 h-25"
              />
              <div className="flex-1">
                <label
                  className="block text-sm font-semibold mb-2"
                  htmlFor="revenuesPerField"
                >
                  Revenues/Field
                </label>
                <Input
                  type="text"
                  name="revenuesPerField"
                  value={cropData.revenuesPerField.toFixed(2)} // Display with 2 decimal points
                  readOnly
                  id="revenuesPerField"
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <img
                src="/images/crops/profit.jpg"
                alt="Total Profit"
                className="w-50 h-25"
              />
              <div className="flex-1">
                <label
                  className="block text-sm font-semibold mb-2"
                  htmlFor="profits"
                >
                  Profits
                </label>
                <Input
                  type="text"
                  name="profits"
                  value={cropData.profits.toFixed(2)} // Display with 2 decimal points
                  readOnly
                  id="profits"
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="flex items-center space-x-4 mb-4">
              <img
                src="/images/crops/reminder.png"
                alt="Note"
                className="w-25 h-25"
              />
              <div className="flex-1">
                <label
                  className="block text-sm font-semibold mb-2"
                  htmlFor="note"
                >
                  Notes
                </label>
                <Input
                  type="text"
                  name="note"
                  value={cropData.note}
                  onChange={handleChange}
                  placeholder="Enter any notes"
                  id="note"
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="default"
              className="w-full p-3  text-white rounded-md "
            >
              Save
            </Button>
          </form>

          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
