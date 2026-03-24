// services/UserService.ts

import { collection, getAggregateFromServer, sum } from "firebase/firestore";
import { BaseService } from "./BaseService";
import { db } from "@/firebaseConfig";

export type TCrop = {
  fieldNumber: string;
  area: string;
  crop: string;
  seedCostPerHa: number;
  fertilizerCostPerHa: number;
  herbicideCostPerHa: number;
  laborCostPerHa: number;
  otherCostsPerHa: number;
  yieldKgPerHa: number;
  pricePerKg: number;
  expensesPerField: number;
  revenuesPerField: number;
  profits: number;
  note: string;
  userId: string;
  id: string;
};

export class CropService extends BaseService<TCrop> {
  constructor() {
    super("crops");
  }

  async getCropsDistribution() {
    const coll = collection(db, this.collectionName);
    const snapshot = await getAggregateFromServer(coll, {
      totalCropExpenses: sum("expensesPerField"),
      totalCropRevenue: sum("revenuesPerField"),
      totalCropProfit: sum("profits"),
      totalLandInProduction: sum("area"),
      // profitPercentagePerCrop: sum("totalMilkProduced"),
    });
    return snapshot.data();
  }
}

export const cropService = new CropService();
