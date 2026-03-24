"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; // Correct way to get dynamic parameters
import { Button } from "@/components/ui/button";
import BackButton from "@/components/back-button";
import { db } from "@/firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"; // ShadCN's DropdownMenu
import { Bars3Icon } from "@heroicons/react/24/outline"; // Heroicons hamburger icon

export default function AnimalEntriesPage() {
  const router = useRouter();
  const { id } = useParams(); // Get the animal ID from the URL
  const [animal, setAnimal] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]); // Entries for this specific animal
  const [filter, setFilter] = useState("all"); // Default filter (all entries)

  const [cost, setCost] = useState<number>(0); // Total cost
  const [revenue, setRevenue] = useState<number>(0); // Total revenue
  const [profitLoss, setProfitLoss] = useState<number>(0); // Total profit/loss

  useEffect(() => {
    if (id && typeof id === "string") {
      // Fetch animal details (identification, species, etc.)
      const fetchAnimal = async () => {
        const animalDocRef = doc(db, "animals", id);
        const animalDocSnap = await getDoc(animalDocRef);
        if (animalDocSnap.exists()) {
          setAnimal(animalDocSnap.data());
        }
      };

      // Fetch animal entries
      const fetchEntries = async () => {
        const entriesCollection = collection(db, "entries");
        const q = query(entriesCollection, where("animalId", "==", id));
        const querySnapshot = await getDocs(q);
        const entriesData: any[] = [];
        querySnapshot.forEach((doc) => {
          entriesData.push({ ...doc.data(), id: doc.id });
        });
        setEntries(entriesData);
      };

      fetchAnimal();
      fetchEntries();
    }
  }, [id]);

  // Calculate total cost, revenue, and profit/loss
  useEffect(() => {
    if (entries.length > 0) {
      const totalCost = entries.reduce((sum, entry) => {
        return entry.entryType === "vetCosts" ||
          entry.entryType === "otherCosts" ||
          entry.entryType === "impregnation"
          ? sum + (entry.totalCost || 0)
          : sum;
      }, 0);

      const totalRevenue = entries.reduce((sum, entry) => {
        return entry.entryType === "milking" || entry.entryType === "butchering"
          ? sum + (entry.revenue || 0)
          : sum;
      }, 0);

      setCost(totalCost);
      setRevenue(totalRevenue);
      setProfitLoss(totalRevenue - totalCost);
    }
  }, [entries]);

  // Filter entries based on category
  const handleFilterChange = (category: string) => {
    setFilter(category);
  };

  // Apply filter to the entries
  const filteredEntries =
    filter === "all"
      ? entries
      : entries.filter((entry) => entry.entryType === filter);

  const handleDeleteAnimal = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this animal and all its entries? This action cannot be undone."
    );

    if (confirmation) {
      try {
        // Delete animal entries first
        const entriesCollection = collection(db, "entries");
        const q = query(entriesCollection, where("animalId", "==", id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        // Then delete the animal
        const animalDocRef = doc(db, "animals", id as string);
        await deleteDoc(animalDocRef);

        // Redirect to livestock page after deletion
        router.push("/livestock");
      } catch (error) {
        console.error("Error deleting animal:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="min-h-screen w-full max-w-lg bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center bggreen">
        {/* Back Button */}
        <div className="flex items-center space-x-4 mb-6 w-full">
          <BackButton to="/livestock" />
        </div>

        {/* Gamou Logo */}
        <img src="/images/gamou-logo.png" alt="Gamou Logo" />

        {/* Animal Identification */}
        <header className="text-3xl font-bold my-4 text-center">
          <h1>Animal Identification: {animal?.identification}</h1>
          {/* Edit Link */}
          <a
            href={`/livestock/edit/${id}`}
            className="textcolor text-sm mt-2 block text-center"
          >
            Edit Animal Details
          </a>
          {/* Delete Link */}
          <a
            onClick={handleDeleteAnimal}
            className="text-red-500 text-sm mt-2 block text-center cursor-pointer"
          >
            Delete Animal
          </a>
        </header>

        {/* Quick View - Cost, Revenue, Profit/Loss */}
        <div className="w-full flex justify-between mb-6">
          <div>
            <p className="font-semibold">Total Cost: ${cost.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">
              Total Revenue: ${revenue.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="font-semibold">Profit: ${profitLoss.toFixed(2)}</p>
          </div>
        </div>

        <div className="w-full border-b border-black mb-5"></div>

        <div className="w-full ">
          <div className="flex justify-between gap-1">
            <div className="w-30">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full p-3  text-white rounded-md "
                  >
                    <span>Filter Entries</span>
                    <Bars3Icon className="text-white text-lg" />{" "}
                    {/* Hamburger icon from Heroicons */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-full">
                  <DropdownMenuItem onClick={() => handleFilterChange("all")}>
                    All Entries
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("impregnation")}
                  >
                    Impregnation
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("milking")}
                  >
                    Milking
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("butchering")}
                  >
                    Butchering
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("vetCosts")}
                  >
                    Vet Costs
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("otherCosts")}
                  >
                    Other Costs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grow">
              {/* Add New Entry Button */}
              <Button
                onClick={() => router.push(`/livestock/entry/add/${id}`)}
                variant="default"
                className="p-3  text-white rounded-md mb-6"
              >
                Add Entry
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full">
          <p className="w-full text-left">filter: {filter}</p>
        </div>

        {/* Entries Table */}
        {filteredEntries.length === 0 ? (
          <p>No entries found.</p>
        ) : (
          <div className="w-full">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 mb-4 shadow-lg rounded-md border border-gray-400 bgcards"
              >
                <div className="flex justify-between">
                  <div className="font-semibold">
                    Entry Type: {entry.entryType}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(entry.timestamp.seconds * 1000).toLocaleString()}
                  </div>
                </div>

                {/* For 'impregnation' entry, show impregnation date */}
                {entry.entryType === "impregnation" && (
                  <div>Impregnation Date: {entry.impregnationDate}</div>
                )}

                {/* Display Cost for cost entries and Revenue for revenue entries */}
                {entry.entryType === "impregnation" ||
                entry.entryType === "vetCosts" ||
                entry.entryType === "otherCosts" ? (
                  <div>Cost: ${entry.totalCost}</div>
                ) : (
                  <div>Revenue: ${entry.revenue}</div>
                )}

                {entry.note && (
                  <div className="text-sm mt-2">Note: {entry.note}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
