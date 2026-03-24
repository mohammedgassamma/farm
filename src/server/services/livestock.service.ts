// services/UserService.ts

import {
  collection,
  count,
  getAggregateFromServer,
  query,
  sum,
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
  animalCost: number;
};
export class LiveStockService extends BaseService<TLivestock> {
  constructor() {
    super("animals");
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
