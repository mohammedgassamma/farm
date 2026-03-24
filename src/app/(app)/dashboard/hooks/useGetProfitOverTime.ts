import { authFirebase } from "@/firebaseAuth";
import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useGetProfitOverTime = ({
  includeUserId,
  months = 6,
}: {
  includeUserId: boolean;
  months?: number;
}) => {
  const [data, setData] = useState<
    Array<{
      monthIndex: number;
      year: number;
      profit: number;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = authFirebase.currentUser?.uid;

  useEffect(() => {
    const fetchProfitOverTime = async () => {
      setIsLoading(true);
      try {
        const currentDate = new Date();
        const startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - (months - 1),
          1
        );
        const endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
          23,
          59,
          59
        );

        // Single query for each collection
        let cropsQuery = query(
          collection(db, "crops"),
          where("createdAt", ">=", startDate),
          where("createdAt", "<=", endDate)
        );

        let livestockQuery = query(
          collection(db, "animals"),
          where("createdAt", ">=", startDate),
          where("createdAt", "<=", endDate)
        );

        // Add userId filter if needed
        if (includeUserId && userId) {
          cropsQuery = query(cropsQuery, where("userId", "==", userId));
          livestockQuery = query(livestockQuery, where("userId", "==", userId));
        }

        // Fetch all documents once
        const [cropsSnapshot, livestockSnapshot] = await Promise.all([
          getDocs(cropsQuery),
          getDocs(livestockQuery),
        ]);

        // const cropsData = cropsSnapshot.docs.map((doc) => ({
        //   id: doc.id,
        //   ...doc.data(),
        // }));
        // console.log("🌾 ALL CROPS DATA:", cropsData);

        // // Log all livestock data
        // const livestockData = livestockSnapshot.docs.map((doc) => ({
        //   id: doc.id,
        //   ...doc.data(),
        // }));
        // console.log("🐄 ALL LIVESTOCK DATA:", livestockData);

        // Group by month on the client side
        const profitByMonth: { [key: string]: number } = {};

        // Process crops data
        cropsSnapshot.forEach((doc) => {
          const data = doc.data();
          const date = data.createdAt?.toDate();
          if (date) {
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            const profit = data.profits || 0;
            profitByMonth[monthKey] = (profitByMonth[monthKey] || 0) + profit;
          }
        });

        // Process livestock data
        livestockSnapshot.forEach((doc) => {
          const data = doc.data();
          const date = data.createdAt?.toDate();
          if (date) {
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            const profit = data.totalProfit || 0;
            profitByMonth[monthKey] = (profitByMonth[monthKey] || 0) + profit;
          }
        });

        // Convert to array and ensure all months are present
        const profitData = [];
        for (let i = months - 1; i >= 0; i--) {
          const targetDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1
          );
          const monthKey = `${targetDate.getFullYear()}-${targetDate.getMonth()}`;

          profitData.push({
            monthIndex: targetDate.getMonth(),
            year: targetDate.getFullYear(),
            profit: Math.round((profitByMonth[monthKey] || 0) * 100) / 100,
          });
        }

        setData(profitData);
      } catch (error) {
        console.error("Error fetching profit over time:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (!userId) {
      return;
    }

    fetchProfitOverTime();
  }, [includeUserId, userId, months, userId]);

  return { data, isLoading };
};
