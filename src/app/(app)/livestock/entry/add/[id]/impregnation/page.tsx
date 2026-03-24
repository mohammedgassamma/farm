"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/back-button";
import { db } from "@/firebaseConfig";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";

export default function AddImpregnationEntryPage() {
  const router = useRouter();
  const { id } = useParams(); // Get animal ID from URL parameters

  const [animalIdentification, setAnimalIdentification] = useState("");
  const [entryData, setEntryData] = useState({
    impregnationType: "",
    impregnationCost: 0,
    impregnationDate: "",
    totalCost: 0, // Field to store calculated cost
  });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
    setEntryData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Calculate the cost based on impregnationCost
      if (name === "impregnationCost") {
        updatedData.totalCost =
          parseFloat(updatedData.impregnationCost.toString()) || 0;
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Make sure that all required fields are filled
      if (
        Object.values(entryData).some((field) => {
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

      // Add the impregnation entry to Firestore
      await addDoc(collection(db, "entries"), {
        animalId: id,
        entryType: "impregnation",
        ...entryData,
        timestamp: new Date(), // Add a timestamp to the entry
      });

      alert("Impregnation entry added successfully!");
      router.push(`/livestock/entry/${id}`); // Navigate back to the animal's entry page
    } catch (error) {
      setErrorMessage("Error adding impregnation entry");
    }
  };

  if (loading) return <div>Loading...</div>;

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
        <header className="text-3xl font-bold my-4 text-center">
          <h1>Animal Identification: {animalIdentification}</h1>
        </header>

        <h2 className="text-2xl font-semibold mb-6">Add Impregnation Entry</h2>

        <div className="w-full border-b border-black mb-5"></div>

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
                htmlFor="impregnationType"
              >
                Impregnation Type
              </label>
              <Input
                type="text"
                name="impregnationType"
                value={entryData.impregnationType}
                onChange={handleChange}
                placeholder="Impregnation Type"
                id="impregnationType"
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/images/breeding_cost.jpg"
              alt="Identification"
              className="w-50 h-25 rounded-sm"
            />
            <div className="flex-1">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="impregnationCost"
              >
                Impregnation Cost
              </label>
              <Input
                type="number"
                name="impregnationCost"
                value={entryData.impregnationCost}
                onChange={handleChange}
                placeholder="Impregnation Cost"
                id="impregnationCost"
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/images/breeding_day.jpg"
              alt="Identification"
              className="w-50 h-25 rounded-sm"
            />
            <div className="flex-1">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="impregnationDate"
              >
                Impregnation Date
              </label>
              <Input
                type="date"
                name="impregnationDate"
                value={entryData.impregnationDate}
                onChange={handleChange}
                placeholder="Impregnation Date"
                id="impregnationDate"
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
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
                htmlFor="cost"
              >
                Total Cost
              </label>
              <Input
                type="text"
                name="cost"
                value={entryData.totalCost.toFixed(2)} // Display with 2 decimal points
                readOnly
                id="cost"
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full p-3  text-white rounded-md "
          >
            Save Impregnation Entry
          </Button>

          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
