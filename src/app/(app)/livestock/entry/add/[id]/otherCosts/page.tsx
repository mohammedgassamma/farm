"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { db } from "@/firebaseConfig";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import BackButton from "@/components/back-button";
import { Input } from "@/components/ui/input";

export default function AddOtherCostsEntryPage() {
  const router = useRouter();
  const { id } = useParams(); // Get animal ID from URL

  const [animalIdentification, setAnimalIdentification] = useState("");
  const [otherCostsData, setOtherCostsData] = useState({
    costDescription: "",
    costType: "",
    costAmount: 0,
    note: "",
    totalCost: 0, // To store the calculated cost
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
    setOtherCostsData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Calculate the total cost for the other cost (this is the costAmount itself)
      if (name === "costAmount") {
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
        Object.values(otherCostsData).some((field) => {
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

      // Add other costs data to Firestore
      await addDoc(collection(db, "entries"), {
        animalId: id,
        entryType: "otherCosts",
        ...otherCostsData,
        timestamp: new Date(), // Add a timestamp
      });

      alert("Other Costs entry added successfully!");
      router.push(`/livestock/entry/${id}`); // Redirect to the animal's entry page
    } catch (error) {
      setErrorMessage("Error adding entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="min-h-screen w-full max-w-lg bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
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

        <h2 className="text-2xl font-semibold mb-6">Add Other Costs Entry</h2>
        <div className="w-full border-b border-gray mb-5"></div>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/images/placeholder.jpg"
              alt="Identification"
              className="w-25 h-25 rounded-sm"
            />
            <div className="flex-1">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="costDescription"
              >
                Cost Description
              </label>
              <Input
                type="text"
                name="costDescription"
                value={otherCostsData.costDescription}
                onChange={handleChange}
                placeholder="Cost Description"
                id="costDescription"
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
                htmlFor="costType"
              >
                Cost Type
              </label>
              <Input
                type="text"
                name="costType"
                value={otherCostsData.costType}
                onChange={handleChange}
                placeholder="Cost Type"
                id="costType"
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/images/Other_cost.jpg"
              alt="Identification"
              className="w-50 h-25 rounded-sm"
            />
            <div className="flex-1">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="costAmount"
              >
                Cost Amount
              </label>
              <Input
                type="number"
                name="costAmount"
                value={otherCostsData.costAmount}
                onChange={handleChange}
                placeholder="Cost Amount"
                id="costAmount"
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
                htmlFor="totalCost"
              >
                Total Cost
              </label>
              <Input
                type="text"
                name="totalCost"
                value={otherCostsData.totalCost.toFixed(2)} // Display calculated total cost
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
