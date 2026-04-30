// services/UserService.ts

import { collection, getAggregateFromServer, sum } from "firebase/firestore";
import { BaseService } from "./BaseService";
import { db } from "@/firebaseConfig";
import { getDocs } from "firebase/firestore";

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
  user?: {           // ← ajouter ce bloc
    email: string;
    createdAt: string;
    ipCountry?: string; 
    country?: string;      // 🔥 AJOUT
  department?: string;   // 🔥 AJOUT
  };
};

export class CropService extends BaseService<TCrop> {
  constructor() {
    super("crops");
  } 
   

async findAllWithUsers() {
  const cropsSnapshot = await getDocs(collection(db, "crops"));
  const usersSnapshot = await getDocs(collection(db, "users"));

  const usersMap = new Map();

  // 🔥 index des users
  usersSnapshot.forEach((doc) => {
    usersMap.set(doc.id, doc.data());
  });

  // 🔥 enrichissement des crops
  const cropsWithUsers: TCrop[] = [];

  cropsSnapshot.forEach((doc) => {
    const cropData = doc.data() as TCrop;

    cropsWithUsers.push({
      ...cropData,
      id: doc.id,
      user: usersMap.get(cropData.userId) || null,
    });
  });

  return cropsWithUsers;
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
