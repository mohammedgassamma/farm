import React, { useRef } from "react";
import { Input } from "../ui/input";
import { Controller, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import Image from "next/image";
import clsx from "clsx";

export type TFormInput = {
  label?: string;
  formHandler: UseFormReturn<any>;
  name: string;
  image?: string;
  imageClassName?: string;
  value?: string | number;
  readOnly?: boolean;
} & React.ComponentProps<"input">;

function createObjectURL(file: any) {
  if (!(file instanceof File || file instanceof Blob)) {
    throw new Error("Input must be a File or Blob object");
  }

  return URL.createObjectURL(file);
}

export const MFormInput = ({
  label,
  name,
  formHandler,
  image,
  imageClassName,
  value,
  readOnly,
  placeholder,
  ...props
}: TFormInput) => {
  const isRadio = props.type === "radio";
  const isFileInput = props.type === "file";
  const isDateInput = props.type === "date";
  const dateInputRef = useRef<HTMLInputElement>(null);

  const newValue = formHandler.watch(name);
  const imageToUse =
    isFileInput && newValue
      ? typeof value === "string"
        ? value
        : createObjectURL(value)
      : undefined;

  // Format date value for display (if it's a date input)
  const formatDateForDisplay = (dateValue: string) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex items-center space-x-4 mb-4 relative">
      {image ? (
        <Image
          src={imageToUse || image}
          alt="Field Number"
          className={clsx("w-25 h-25 rounded-sm", imageClassName)}
          width={700}
          height={700}
        />
      ) : null}
      <Controller
        name={name}
        control={formHandler.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex gap-0!">
            {!isRadio ? (
              <>
                <FieldLabel htmlFor={field.name} className="">
                  {label}
                </FieldLabel>
                {isDateInput ? (
                  <div
                    className={clsx(
                      "w-full  border border-gray-300 rounded-sm mt-[0.5rem] h-[35px] cursor-pointer flex items-center overflow-hidden",
                      readOnly ? "bg-gray-100" : "bg-white",
                      !field.value && "text-gray-400"
                    )}
                  >
                    {/* Hidden actual date input */}
                    <Input
                      {...field}
                      {...props}
                      {...(isFileInput
                        ? {
                            onChange: (e) => {
                              const file = e.target.files?.[0] || null;
                              field.onChange(file);
                            },
                          }
                        : {})}
                      value={isFileInput ? "" : readOnly ? value : (field.value ?? "")}
                      readOnly={readOnly}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className={clsx(
                        "!w-full p-3 rounded-md h-[35px] !border-0"
                      )}
                    />
                    {/* Visible div that looks like an input and triggers date picker */}
                  </div>
                ) : (
                  <Input
                    {...field}
                    {...props}
                    {...(isFileInput
                      ? {
                          onChange: (e) => {
                            const file = e.target.files?.[0] || null;
                            field.onChange(file);
                          },
                        }
                      : {})}
                    value={isFileInput ? "" : readOnly ? value : (field.value ?? "")}
                    readOnly={readOnly}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    className={clsx(
                      "w-full p-3 border border-gray-300 rounded-md h-[35px]",
                      readOnly ? "bg-gray-100" : "bg-white"
                    )}
                  />
                )}
              </>
            ) : (
              <>
                <label className="flex !w-[30px] !justify-start items-center gap-x-2 cursor-pointer">
                  <input
                    type="radio"
                    {...field}
                    {...props}
                    checked={field.value === value}
                    value={readOnly ? value : value}
                  />
                  <span>{label}</span>
                </label>
              </>
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
};
