import * as XLSX from "xlsx";

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
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// Colonnes Agriculture (sans Notes)
export const formatCropsForExport = (crops: any[]) => {
    return crops.map((crop) => ({
        "Field Number": crop.fieldNumber,
        "Area (Ha)": crop.area,
        "Crop Planted": crop.crop,
        "Seed Cost/Ha": crop.seedCostPerHa,
        "Fertilizer Cost/Ha": crop.fertilizerCostPerHa,
        "Herbicide Cost/Ha": crop.herbicideCostPerHa,
        "Labor Cost/Ha": crop.laborCostPerHa,
        "Other Costs/Ha": crop.otherCostsPerHa,
        "Yield Kg/Ha": crop.yieldKgPerHa,
        "Price/Kg": crop.pricePerKg,
        "Expenses/Field": crop.expensesPerField,
        "Revenues/Field": crop.revenuesPerField,
        "Profit/Field": crop.profits,
    }));
};

// Colonnes Élevage (sans Notes)
export const formatLivestockForExport = (animals: any[]) => {
    return animals.map((animal) => ({
        Identification: animal.identification,
        "Date of Birth": animal.dateOfBirth || "",
        Sex: animal.sex,
        Father: animal.father || "",
        Mother: animal.mother || "",
        "Animal Cost": animal.animalCost || 0,
        "Feed Cost": animal.feedCost || 0,
        "Vet Cost": animal.vetCost || 0,
        "Other Costs": animal.otherCosts || 0,
        "Insemination Cost": animal.inseminationCost || 0,
        "Insemination Date": animal.inseminationDate || "",
        "Breeding Date": animal.breedingDate || "",
        "Last Birth Date": animal.lastBirthDate || "",
        "Total Milk Produced": animal.totalMilkProduced || 0,
        "Milk Price/Gallon": animal.milkPricePerGallon || 0,
        "Sale Price": animal.salePrice || 0,
        "Total Cost": animal.totalCost || 0,
        "Total Income": animal.totalIncome || 0,
        "Total Profit": animal.totalProfit || 0,
    }));
};
