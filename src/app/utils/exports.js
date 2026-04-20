import { collection, getDocs, query, where } from "firebase/firestore";
import * as XLSX from "xlsx";
import { db } from "@/firebaseConfig";

function buildCropRow(d) {
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
    year: d.year ?? "",
  };
}

function buildLivestockRow(d) {
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
    year: d.year ?? "",
  };
}

function downloadWorkbook(wb, fileName) {
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

export async function exportCrops(user) {
  const snapshot = await getDocs(
    query(collection(db, "crops"), where("userId", "==", user.uid))
  );
  const rows = snapshot.docs.map((d) => buildCropRow(d.data()));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Crops");
  downloadWorkbook(wb, `crops_${user.uid.slice(0, 8)}`);
}

export async function exportLivestock(user) {
  const snapshot = await getDocs(
    query(collection(db, "livestock"), where("userId", "==", user.uid))
  );
  const rows = snapshot.docs.map((d) => buildLivestockRow(d.data()));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Livestock");
  downloadWorkbook(wb, `livestock_${user.uid.slice(0, 8)}`);
}

export async function exportAllUserData(user) {
  const [cropsSnap, livestockSnap] = await Promise.all([
    getDocs(query(collection(db, "crops"), where("userId", "==", user.uid))),
    getDocs(query(collection(db, "livestock"), where("userId", "==", user.uid))),
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(cropsSnap.docs.map((d) => buildCropRow(d.data()))),
    "Crops"
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(livestockSnap.docs.map((d) => buildLivestockRow(d.data()))),
    "Livestock"
  );
  downloadWorkbook(wb, `farm_data_${new Date().toISOString().split("T")[0]}`);
}

export async function exportCropsAsAdmin() {
  const snapshot = await getDocs(collection(db, "crops"));
  const rows = snapshot.docs.map((d) => buildCropRow(d.data()));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "All Crops");
  downloadWorkbook(wb, `admin_crops_${new Date().toISOString().split("T")[0]}`);
}

export async function exportLivestockAsAdmin() {
  const snapshot = await getDocs(collection(db, "livestock"));
  const rows = snapshot.docs.map((d) => buildLivestockRow(d.data()));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "All Livestock");
  downloadWorkbook(wb, `admin_livestock_${new Date().toISOString().split("T")[0]}`);
}

export async function exportAllDataAsAdmin() {
  await Promise.all([exportCropsAsAdmin(), exportLivestockAsAdmin()]);
}
