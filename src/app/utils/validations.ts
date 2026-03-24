import { z } from "zod/v4";
import * as yup from "yup";

const conditionalRequiredNumber = ({
  fieldName,
  condition,
  errorMessage,
}: {
  fieldName: string;
  condition: (value: any) => boolean;
  errorMessage: string;
}) => {
  return yup.number().when(fieldName, {
    is: condition,
    then: (schema) => schema.required(errorMessage),
    otherwise: (schema) => schema.notRequired(),
  });
};
const conditionalNotRequiredNumber = ({
  fieldName,
  condition,
  errorMessage,
}: {
  fieldName: string;
  condition: (value: any) => boolean;
  errorMessage: string;
}) => {
  return yup.number().when(fieldName, {
    is: condition,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.notRequired(),
  });
};

// Or for string fields
const conditionalRequiredString = ({
  fieldName,
  condition,
  errorMessage,
}: {
  fieldName: string;
  condition: (value: any) => boolean;
  errorMessage: string;
}) => {
  return yup.string().when(fieldName, {
    is: condition,
    then: (schema) => schema.required(errorMessage),
    otherwise: (schema) => schema.notRequired(),
  });
};
const conditionalNotRequiredString = ({
  fieldName,
  condition,
  errorMessage,
}: {
  fieldName: string;
  condition: (value: any) => boolean;
  errorMessage: string;
}) => {
  return yup.string().when(fieldName, {
    is: condition,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.notRequired(),
  });
};

export const addCropValidation = yup
  .object()
  .shape({
    fieldNumber: yup.string().required(),
    area: yup.string().notRequired(),
    crop: yup.string().notRequired(),
    seedCostPerHa: yup.number().notRequired(),
    fertilizerCostPerHa: yup.number().notRequired(),
    herbicideCostPerHa: yup.number().notRequired(),
    laborCostPerHa: yup.number().notRequired(),
    otherCostsPerHa: yup.number().notRequired(),
    yieldKgPerHa: yup.number().notRequired(),
    pricePerKg: yup.number().notRequired(),
    expensesPerField: yup.number().notRequired(),
    revenuesPerField: yup.number().notRequired(),
    profits: yup.number().notRequired(),
    note: yup.string().notRequired(),
  })
  .required();

export const addLivestockValidation = yup
  .object()
  .shape({
    // pictureUrl: yup.().required(),
    identification: yup.string().required(),
    dateOfBirth: yup.string().notRequired(),
    sex: yup.string().notRequired(),
    father: yup.string().notRequired(),
    mother: yup.string().notRequired(),
    inseminationCost: conditionalNotRequiredNumber({
      fieldName: "sex",
      condition: (val) => val === "female",
      errorMessage: "Insemination Cost is required for female animals",
    }),
    inseminationDate: conditionalNotRequiredString({
      fieldName: "sex",
      condition: (val) => val === "female",
      errorMessage: "Insemination Date is required for female animals",
    }),
    breedingDate: conditionalNotRequiredString({
      fieldName: "sex",
      condition: (val) => val === "female",
      errorMessage: "Breeding Date is required for female animals",
    }),
    lastBirthDate: conditionalNotRequiredString({
      fieldName: "sex",
      condition: (val) => val === "female",
      errorMessage: "Last Birth Date is required for female animals",
    }),
    totalMilkProduced: conditionalNotRequiredNumber({
      fieldName: "sex",
      condition: (val) => val === "female",
      errorMessage: "Total Milk Produced is required for female animals",
    }),
    milkPricePerGallon: conditionalNotRequiredNumber({
      fieldName: "sex",
      condition: (val) => val === "female",
      errorMessage: "Milk Price Per Gallon is required for female animals",
    }),
    salePrice: conditionalNotRequiredNumber({
      fieldName: "sex",
      condition: (val) => val === "male",
      errorMessage: "Amount Of Meat is required for male animals",
    }),
    animalCost: conditionalNotRequiredNumber({
      fieldName: "sex",
      condition: (val) => val === "male",
      errorMessage: "Animal Cost is required for male animals",
    }),

    feedCost: yup.number().notRequired(),
    vetCost: yup.number().notRequired(),
    otherCosts: yup.number().notRequired(),
    totalCost: yup.number().notRequired(),
    totalIncome: yup.number().notRequired(),
    totalProfit: yup.number().notRequired(),
    note: yup.string().notRequired(),
  })
  .required();

export const addOrEditEducationValidation = yup
  .object()
  .shape({
    title: yup.string().required(),
    videoUrl: yup.string().required(),
    // thumbnailUrl: yup.object().required(),
    description: yup.string().notRequired(),
  })
  .required();

export const addOrEditProductValidation = yup
  .object()
  .shape({
    name: yup.string().required(),
    // imageURL: yup.string().required(),
    description: yup.string().notRequired(),
    category: yup.string().notRequired(),
    price: yup.number().required(),
    quantity: yup.number().notRequired(),
    sku: yup.string().notRequired(),
    currency: yup.string().notRequired(),
  })
  .required();

export const addOrEditAlertValidation = yup
  .object()
  .shape({
    title: yup.string().required(),
    type: yup.string().required(),
    message: yup.string().required(),
  })
  .required();

export const addOrEditSubscriptionConfigValidation = yup
  .object()
  .shape({
    amount: yup.number().required(),
    trialPeriod: yup.number().required(),
  })
  .required();
