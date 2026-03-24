import { toast, ToasterProps } from "sonner";

type TShowToast = {
  type: "success" | "error" | "info" | "warning";
  message: string;
} & ToasterProps;

export const showToast = ({ message, type, ...props }: TShowToast) => {
  return toast[type](message, {
    ...props,
  });
};
