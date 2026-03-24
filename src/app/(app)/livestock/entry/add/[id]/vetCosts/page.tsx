"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { db } from "@/firebaseConfig";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import BackButton from "@/components/back-button";
import { Input } from "@/components/ui/input";

export default function AddVetCostsEntryPage() {
  const router = useRouter();
  const { id } = useParams(); // Get animal ID from URL

  const [animalIdentification, setAnimalIdentification] = useState("");
  const [vetCostsData, setVetCostsData] = useState({
    vetCost: 0,
    treatmentDescription: "",
    note: "",
    totalCost: 0, // To store the calculated total cost
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
    setVetCostsData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Calculate the total cost for the vet treatment (this is the vet cost itself)
      if (name === "vetCost") {
        updatedData.totalCost = parseFloat(value) || 0; // Store the total cost
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
        Object.values(vetCostsData).some((field) => {
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

      // Add vet cost data to Firestore
      await addDoc(collection(db, "entries"), {
        animalId: id,
        entryType: "vetCosts",
        ...vetCostsData,
        timestamp: new Date(), // Add a timestamp
      });

      alert("Vet Costs entry added successfully!");
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

        <h2 className="text-2xl font-semibold mb-6">
          Add Vet Costs Entry for Animal
        </h2>
        <div className="w-full border-b border-black mb-5"></div>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/images/Vet_cost.jpg"
              alt="Identification"
              className="w-50 h-25 rounded-sm"
            />
            <div className="flex-1">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="vetCost"
              >
                Vet Cost
              </label>
              <Input
                type="number"
                name="vetCost"
                value={vetCostsData.vetCost}
                onChange={handleChange}
                placeholder="Vet Cost"
                id="vetCost"
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
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
                htmlFor="treatmentDescription"
              >
                Treatment Description
              </label>
              <Input
                type="text"
                name="treatmentDescription"
                value={vetCostsData.treatmentDescription}
                onChange={handleChange}
                placeholder="Treatment Description"
                id="treatmentDescription"
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
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
                value={vetCostsData.note}
                onChange={handleChange}
                placeholder="Any additional notes"
                id="note"
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/images/Total_expenses.jpg"
              alt="Identification"
              className="w-50 h-25 rounded-sm"
            />
            <div className="flex-1">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="totalCost"
              >
                Total Cost
              </label>
              <Input
                type="text"
                name="totalCost"
                value={vetCostsData.totalCost.toFixed(2)} // Display calculated cost
                readOnly
                id="totalCost"
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full p-3  text-white rounded-md "
          >
            Save Vet Costs Entry
          </Button>

          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
