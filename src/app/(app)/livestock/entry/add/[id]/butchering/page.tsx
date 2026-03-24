"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { db } from "@/firebaseConfig";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import BackButton from "@/components/back-button";
import { Input } from "@/components/ui/input";

export default function AddButcheringEntryPage() {
  const router = useRouter();
  const { id } = useParams(); // Get animal ID from URL

  const [animalIdentification, setAnimalIdentification] = useState("");
  const [butcheringData, setButcheringData] = useState({
    amountOfMeat: 0,
    meatPricePerPound: 0,
    revenue: 0, // New field to store calculated cost
    note: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && typeof id === "string") {
      const fetchAnimal = async () => {
        try {
          const animalDocRef = doc(db, "animals", id);
          const animalDocSnap = await getDoc(animalDocRef);

          if (animalDocSnap.exists()) {
            setAnimalIdentification(animalDocSnap.data().identification);
          } else {
            setErrorMessage("Animal not found");
          }
        } catch (error) {
          setErrorMessage("Error fetching animal data");
        } finally {
          setLoading(false);
        }
      };

      fetchAnimal();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setButcheringData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Recalculate the cost (amountOfMeat * meatPricePerPound)
      if (name === "amountOfMeat" || name === "meatPricePerPound") {
        updatedData.revenue =
          (parseFloat(String(updatedData.amountOfMeat || 0)) || 0) *
          (parseFloat(String(updatedData.meatPricePerPound || 0)) || 0);
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (
        Object.values(butcheringData).some((field) => {
          // Check for empty string or undefined (for string fields)
          if (typeof field === "string" && field.trim() === "") {
            return true;
          }
          // Check for zero or undefined (for numeric fields)
          if (typeof field === "number" && field === 0) {
            return true;
          }
          // If the value is neither a string nor number, treat it as an invalid field
          return false;
        })
      ) {
        setErrorMessage("All fields are required!");
        setLoading(false);
        return;
      }

      // Add butchering data to Firestore
      await addDoc(collection(db, "entries"), {
        animalId: id,
        entryType: "butchering",
        ...butcheringData,
        timestamp: new Date(), // Add a timestamp to the entry
      });

      alert("Butchering entry added successfully!");
      router.push(`/livestock/entry/${id}`); // Redirect to the animal's entry page
    } catch (error) {
      setErrorMessage("Error adding entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="min-h-screen w-full max-w-lg bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center bggreen">
        <div className="flex items-center space-x-4 mb-6 w-full">
          {/* Back Button */}
          <BackButton />
        </div>

        {/* Gamou Logo */}
        <img src="/images/gamou-logo.png" alt="Gamou Logo" />

        {/* Animal Identification */}
        <header className="text-2xl font-bold my-4 text-center">
          <h1>Animal Identification: {animalIdentification}</h1>
        </header>

        <h2 className="text-2xl font-semibold mb-6">Add Butchering Entry</h2>

        <div className="w-full border-b border-black mb-5"></div>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/images/Total_Beef.png"
              alt="Identification"
              className="w-25 h-25 rounded-sm"
            />
            <div className="flex-1">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="amountOfMeat"
              >
                Amount of Meat (Pounds)
              </label>
              <Input
                type="number"
                name="amountOfMeat"
                value={butcheringData.amountOfMeat}
                onChange={handleChange}
                placeholder="Amount of Meat"
                id="amountOfMeat"
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/images/Beef_price.jpg"
              alt="Identification"
              className="w-50 h-25 rounded-sm"
            />
            <div className="flex-1">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="meatPricePerPound"
              >
                Meat Price Per Pound
              </label>
              <Input
                type="number"
                name="meatPricePerPound"
                value={butcheringData.meatPricePerPound}
                onChange={handleChange}
                placeholder="Meat Price Per Pound"
                id="meatPricePerPound"
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>

          {/* Calculated Cost */}
          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/images/Gross_Income.jpg"
              alt="Identification"
              className="w-50 h-25 rounded-sm"
            />
            <div className="flex-1">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="cost"
              >
                Total Cost
              </label>
              <Input
                type="text"
                name="cost"
                value={butcheringData.revenue.toFixed(2)} // Display with 2 decimal points
                readOnly
                id="cost"
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 bg-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/images/placeholder.jpg"
              alt="Identification"
              className="w-25 h-25 rounded-sm"
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
                value={butcheringData.note}
                onChange={handleChange}
                placeholder="Any additional notes"
                id="note"
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full p-3  text-white rounded-md "
          >
            Save Entry
          </Button>

          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
