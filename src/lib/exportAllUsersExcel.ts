import * as XLSX from "xlsx";
import { formatLivestockForExport } from "@/lib/useExportExcel";
import { formatCropsForExport } from "@/lib/useExportExcel"; // si déjà existant
import { useTranslations } from "next-intl";

export const exportAllUsersToExcel = ({
  livestockData,
  cropsData,
  t,
}: {
  livestockData: any[];
  cropsData: any[];
  t: (key: string) => string;
}) => {
  const workbook = XLSX.utils.book_new();
 
  // Sheet Elevage

  const livestockFormatted = formatLivestockForExport(livestockData, t);
  const livestockSheet = XLSX.utils.json_to_sheet(livestockFormatted);
  XLSX.utils.book_append_sheet(workbook, livestockSheet, "Elevage");

  // Sheet Agriculture
  const cropsFormatted = formatCropsForExport(cropsData, t);
  const cropsSheet = XLSX.utils.json_to_sheet(cropsFormatted);
  XLSX.utils.book_append_sheet(workbook, cropsSheet, "Agriculture");

  XLSX.writeFile(
    workbook,
    `all_users_data_${new Date().toISOString().split("T")[0]}.xlsx`
  );
};