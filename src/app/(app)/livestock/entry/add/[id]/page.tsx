"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; // Correct way to get dynamic parameters
import { Button } from "@/components/ui/button";
import BackButton from "@/components/back-button";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function AddEntryPage() {
  const router = useRouter();
  const { id } = useParams(); // Get the animal ID from the URL
  const [animalIdentification, setAnimalIdentification] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && typeof id === "string") {
      const fetchAnimal = async () => {
        try {
          const animalDocRef = doc(db, "animals", id);
          const animalDocSnap = await getDoc(animalDocRef);

          if (animalDocSnap.exists()) {
            setAnimalIdentification(animalDocSnap.data().identification);
          } else {
            setAnimalIdentification("Animal not found");
          }
        } catch (error) {
          console.error("Error fetching animal data:", error);
          setAnimalIdentification("Error fetching animal data");
        } finally {
          setLoading(false);
        }
      };

      fetchAnimal();
    } else {
      setLoading(false);
      setAnimalIdentification("No animal ID provided");
    }
  }, [id]);

  const handleEntryTypeSelection = (entryType: string) => {
    // Redirect to the appropriate page based on selected entry type
    router.push(`/livestock/entry/add/${id}/${entryType}`);
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading until the id is available
  }

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

        <h2 className="text-3xl font-semibold mb-6">Select Entry Type</h2>

        <div className="w-full border-b border-black mb-5"></div>

        {/* Entry Type Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full mb-4">
          <Button
            onClick={() => handleEntryTypeSelection("impregnation")}
            className="w-full p-3  text-white rounded-md "
          >
            Impregnation
          </Button>
          <Button
            onClick={() => handleEntryTypeSelection("milking")}
            className="w-full p-3  text-white rounded-md "
          >
            Milking
          </Button>
          <Button
            onClick={() => handleEntryTypeSelection("butchering")}
            className="w-full p-3  text-white rounded-md "
          >
            Butchering
          </Button>
          <Button
            onClick={() => handleEntryTypeSelection("vetCosts")}
            className="w-full p-3  text-white rounded-md "
          >
            Vet Costs
          </Button>
          <Button
            onClick={() => handleEntryTypeSelection("otherCosts")}
            className="w-full p-3  text-white rounded-md "
          >
            Other Costs
          </Button>
        </div>
      </div>
    </div>
  );
}
