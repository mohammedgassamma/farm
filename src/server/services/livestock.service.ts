// services/UserService.ts

import {
  collection,
  count,
  getAggregateFromServer,
  query,
  sum,
  getDocs,
} from "firebase/firestore";
import { BaseService } from "./BaseService";
import { db } from "@/firebaseConfig";

export type TLivestock = {
  pictureUrl: string;
  identification: string;
  dateOfDate: string;
  sex: string;
  father: string;
  mother: string;
  inseminationCost: number;
  inseminationDate: string;
  breedingCost: number;
  breedingDate: string;
  lastBirthDate: string;
  totalMilkProduced: number;
  feedCost: number;
  vetCost: number;
  otherCosts: number;
  milkPricePerGallon: number;
  salePrice: number;
  totalCost: number;
  totalIncome: number;
  totalProfit: number;
  note: string;
  id: string;
  userId: string;
  animalCost: number;
    user?: {           // ← ajouter ce bloc
    email: string;
    createdAt: string;
    ipCountry?: string;
    country?: string;      // 🔥 AJOUT
  department?: string;   // 🔥 AJOUT
  };
};
export class LiveStockService extends BaseService<TLivestock> {
  constructor() {
    super("animals");
  } 
  async findAllWithUsers() {
  const livestockSnapshot = await getDocs(collection(db, "animals"));
  const usersSnapshot = await getDocs(collection(db, "users"));

  const usersMap = new Map();

  usersSnapshot.forEach((doc) => {
    usersMap.set(doc.id, doc.data());
  });

  const livestockWithUsers: TLivestock[] = [];

 livestockSnapshot.forEach((doc) => {
  const data = doc.data() as TLivestock;

  

  livestockWithUsers.push({
    ...data,
    id: doc.id,
    user: usersMap.get(data.userId)|| null,
  });

  
});
  

  return livestockWithUsers;
}
  async getLivestockDistribution() {
    const coll = collection(db, this.collectionName);
    const snapshot = await getAggregateFromServer(coll, {
      // totalLivestockExpenses: sum("totalCost"),
      // totalLivestockRevenue: sum("totalIncome"),
      // totalLivestockProfit: sum("totalProfit"),
      totalNumberOfLivestock: count(),
      totalMilkProduced: sum("totalMilkProduced"),
      totalMeatProduced: sum("amountOfMeat"),
    });
    return snapshot.data();
  }
}

export const livestockService = new LiveStockService();
