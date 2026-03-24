import { collection, getDocs, query, where } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Papa from "papaparse";
import { db, storage } from "../firebase"; // adjust path if needed

export async function exportCrops(user) {
  const cropsSnapshot = await getDocs(
    query(collection(db, "crops"), where("userId", "==", user.uid))
  );

  const cropColumns = [
    "email","fieldNumber","area","cropPlanted","seedCostPerHa",
    "fertilizerCostPerHa","herbicideCostPerHa","laborCostPerHa",
    "otherCostsPerHa","yieldKgPerHa","pricePerKg","expensesPerField",
    "revenuesPerField","profits","notes","year"
  ];

  const cropRows = cropsSnapshot.docs.map(doc => {
    const d = doc.data();
    return {
      email: d.email ?? "",
      fieldNumber: d.fieldNumber ?? "",
      area: d.area ?? "",
      cropPlanted: d.cropPlanted ?? "",
      seedCostPerHa: d.seedCostPerHa ?? "",
      fertilizerCostPerHa: d.fertilizerCostPerHa ?? "",
      herbicideCostPerHa: d.herbicideCostPerHa ?? "",
      laborCostPerHa: d.laborCostPerHa ?? "",
      otherCostsPerHa: d.otherCostsPerHa ?? "",
      yieldKgPerHa: d.yieldKgPerHa ?? "",
      pricePerKg: d.pricePerKg ?? "",
      expensesPerField: d.expensesPerField ?? "",
      revenuesPerField: d.revenuesPerField ?? "",
      profits: d.profits ?? "",
      notes: d.notes ?? "",
      year: d.year ?? ""
    };
  });

  const csv = Papa.unparse(cropRows, { columns: cropColumns });

  const storageRef = ref(storage, `exports/${user.uid}/crops.csv`);
  await uploadString(storageRef, csv);

  return await getDownloadURL(storageRef);
}
export async function exportLivestock(user) {
  const livestockSnapshot = await getDocs(
    query(collection(db, "livestock"), where("userId", "==", user.uid))
  );

  const livestockColumns = [
    "email","identification","dateOfBirth","gender","papa","mama",
    "animalCost","feedCost","vetCost","otherCosts","inseminationCost",
    "totalMilkProducedLiters","milkPricePerLiter","totalCost",
    "totalIncome","totalProfit","totalSale","notes","year"
  ];

  const livestockRows = livestockSnapshot.docs.map(doc => {
    const d = doc.data();
    return {
      email: d.email ?? "",
      identification: d.identification ?? "",
      dateOfBirth: d.dateOfBirth ?? "",
      gender: d.gender ?? "",
      papa: d.papa ?? "",
      mama: d.mama ?? "",
      animalCost: d.animalCost ?? "",
      feedCost: d.feedCost ?? "",
      vetCost: d.vetCost ?? "",
      otherCosts: d.otherCosts ?? "",
      inseminationCost: d.inseminationCost ?? "",
      totalMilkProducedLiters: d.totalMilkProducedLiters ?? "",
      milkPricePerLiter: d.milkPricePerLiter ?? "",
      totalCost: d.totalCost ?? "",
      totalIncome: d.totalIncome ?? "",
      totalProfit: d.totalProfit ?? "",
      totalSale: d.totalSale ?? "",
      notes: d.notes ?? "",
      year: d.year ?? ""
    };
  });

  const csv = Papa.unparse(livestockRows, { columns: livestockColumns });

  const storageRef = ref(storage, `exports/${user.uid}/livestock.csv`);
  await uploadString(storageRef, csv);

  return await getDownloadURL(storageRef);
}


export async function exportAllUserData(user) {
  const cropsUrl = await exportCrops(user);
  const livestockUrl = await exportLivestock(user);
  return { cropsUrl, livestockUrl };
}


export async function exportCropsAsAdmin() {
  const cropsSnapshot = await getDocs(collection(db, "crops"));

  // same cropColumns and row logic as above
  // but without the userId filter

  const cropColumns = [
    "email","fieldNumber","area","cropPlanted","seedCostPerHa",
    "fertilizerCostPerHa","herbicideCostPerHa","laborCostPerHa",
    "otherCostsPerHa","yieldKgPerHa","pricePerKg","expensesPerField",
    "revenuesPerField","profits","notes","year"
  ];

  const cropRows = cropsSnapshot.docs.map(doc => {
    const d = doc.data();
    return {
      email: d.email ?? "",
      fieldNumber: d.fieldNumber ?? "",
      area: d.area ?? "",
      cropPlanted: d.cropPlanted ?? "",
      seedCostPerHa: d.seedCostPerHa ?? "",
      fertilizerCostPerHa: d.fertilizerCostPerHa ?? "",
      herbicideCostPerHa: d.herbicideCostPerHa ?? "",
      laborCostPerHa: d.laborCostPerHa ?? "",
      otherCostsPerHa: d.otherCostsPerHa ?? "",
      yieldKgPerHa: d.yieldKgPerHa ?? "",
      pricePerKg: d.pricePerKg ?? "",
      expensesPerField: d.expensesPerField ?? "",
      revenuesPerField: d.revenuesPerField ?? "",
      profits: d.profits ?? "",
      notes: d.notes ?? "",
      year: d.year ?? ""
    };
  });

  const csv = Papa.unparse(cropRows, { columns: cropColumns });

  const storageRef = ref(storage, `exports/admin/crops_all.csv`);
  await uploadString(storageRef, csv);

  return await getDownloadURL(storageRef);
}

export async function exportLivestockAsAdmin() {
  const livestockSnapshot = await getDocs(collection(db, "livestock"));

  const livestockColumns = [
    "email","identification","dateOfBirth","gender","papa","mama",
    "animalCost","feedCost","vetCost","otherCosts","inseminationCost",
    "totalMilkProducedLiters","milkPricePerLiter","totalCost",
    "totalIncome","totalProfit","totalSale","notes","year"
  ];

  const livestockRows = livestockSnapshot.docs.map(doc => {
    const d = doc.data();
    return {
      email: d.email ?? "",
      identification: d.identification ?? "",
      dateOfBirth: d.dateOfBirth ?? "",
      gender: d.gender ?? "",
      papa: d.papa ?? "",
      mama: d.mama ?? "",
      animalCost: d.animalCost ?? "",
      feedCost: d.feedCost ?? "",
      vetCost: d.vetCost ?? "",
      otherCosts: d.otherCosts ?? "",
      inseminationCost: d.inseminationCost ?? "",
      totalMilkProducedLiters: d.totalMilkProducedLiters ?? "",
      milkPricePerLiter: d.milkPricePerLiter ?? "",
      totalCost: d.totalCost ?? "",
      totalIncome: d.totalIncome ?? "",
      totalProfit: d.totalProfit ?? "",
      totalSale: d.totalSale ?? "",
      notes: d.notes ?? "",
      year: d.year ?? ""
    };
  });

  const csv = Papa.unparse(livestockRows, { columns: livestockColumns });

  const storageRef = ref(storage, `exports/admin/livestock_all.csv`);
  await uploadString(storageRef, csv);

  return await getDownloadURL(storageRef);
}

export async function exportAllDataAsAdmin() {
  const cropsUrl = await exportCropsAsAdmin();
  const livestockUrl = await exportLivestockAsAdmin();
  return { cropsUrl, livestockUrl };
}

