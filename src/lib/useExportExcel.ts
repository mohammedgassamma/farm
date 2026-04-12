import * as XLSX from "xlsx";
import { useTranslations } from "next-intl";

interface SheetData {
  data: Record<string, any>[];
  sheetName: string;
}

export const exportTwoSheetsToExcel = ({
  sheets,
  fileName,
}: {
  sheets: SheetData[];
  fileName: string;
}) => {
  if (!sheets || sheets.length === 0) return;
  const workbook = XLSX.utils.book_new();
  sheets.forEach(({ data, sheetName }) => {
    if (!data || data.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToExcel = ({
  data,
  fileName,
  sheetName,
}: {
  data: Record<string, any>[];
  fileName: string;
  sheetName: string;
}) => {
  if (!data || data.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook  = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// ── CROPS ──────────────────────────────────────────────────────────────────
// useTranslations ne peut pas être appelé dans une fonction utilitaire normale
// → on passe les labels traduits en paramètre depuis le composant qui appelle
export const formatCropsForExport = (
  crops: any[],
  t: (key: string) => string
) => {
  return crops.map((crop) => ({
    [t("email")]:             crop.user?.email ?? "",
    [t("registrationDate")]:  crop.user?.createdAt
                                ? crop.user.createdAt.toDate().toLocaleDateString()
                                : "",
    [t("country")]:           crop.user?.country     || "",
    [t("department")]:        crop.user?.department  || "",
    [t("fieldNumber")]:       crop.fieldNumber,
    [t("area")]:              crop.area,
    [t("cropPlanted")]:       crop.crop,
    [t("seedCost")]:          crop.seedCostPerHa,
    [t("fertilizerCost")]:    crop.fertilizerCostPerHa,
    [t("herbicideCost")]:     crop.herbicideCostPerHa,
    [t("laborCost")]:         crop.laborCostPerHa,
    [t("otherCosts")]:        crop.otherCostsPerHa,
    [t("yieldKg")]:           crop.yieldKgPerHa,
    [t("priceKg")]:           crop.pricePerKg,
    [t("expenses")]:          crop.expensesPerField,
    [t("revenues")]:          crop.revenuesPerField,
    [t("profit")]:            crop.profits,
  }));
};

// ── LIVESTOCK ──────────────────────────────────────────────────────────────
export const formatLivestockForExport = (
  animals: any[],
  t: (key: string) => string
) => {
  return animals.map((animal) => ({
    [t("email")]:              animal.user?.email ?? "",
    [t("registrationDate")]:   animal.user?.createdAt
                                 ? animal.user.createdAt.toDate().toLocaleDateString()
                                 : "",
    [t("country")]:            animal.user?.country    || "",
    [t("department")]:         animal.user?.department || "",
    [t("identification")]:     animal.identification,
    [t("dateOfBirth")]:        animal.dateOfBirth      || "",
    [t("sex")]:                animal.sex,
    [t("father")]:             animal.father           || "",
    [t("mother")]:             animal.mother           || "",
    [t("animalCost")]:         animal.animalCost       || 0,
    [t("feedCost")]:           animal.feedCost         || 0,
    [t("vetCost")]:            animal.vetCost          || 0,
    [t("otherCosts")]:         animal.otherCosts       || 0,
    [t("inseminationCost")]:   animal.inseminationCost || 0,
    [t("inseminationDate")]:   animal.inseminationDate || "",
    [t("breedingDate")]:       animal.breedingDate     || "",
    [t("lastBirthDate")]:      animal.lastBirthDate    || "",
    [t("totalMilk")]:          animal.totalMilkProduced || 0,
    [t("milkPrice")]:          animal.milkPricePerGallon || 0,
    [t("salePrice")]:          animal.salePrice        || 0,
    [t("totalCost")]:          animal.totalCost        || 0,
    [t("totalIncome")]:        animal.totalIncome      || 0,
    [t("totalProfit")]:        animal.totalProfit      || 0,
  }));
};