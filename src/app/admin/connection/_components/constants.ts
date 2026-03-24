import { EAlertType } from "@/server/services/alert.service";

export const getAlertTypeClass = ({ type }: { type: EAlertType }) => {
  switch (type) {
    case EAlertType.SYSTEM:
      return "bg-blue-500";
    case EAlertType.LOCAL:
      return "bg-orange-100 ";
    case EAlertType.ECONOMICAL:
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};
export const ALERT_TYPE_OPTIONS = [
  { label: "System", value: EAlertType.SYSTEM },
  { label: "Local", value: EAlertType.LOCAL },
  { label: "Economical", value: EAlertType.ECONOMICAL },
];
