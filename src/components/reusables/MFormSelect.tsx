import React from "react";
import { Controller } from "react-hook-form";
import { Field, FieldError } from "../ui/field";
import Image from "next/image";
import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TFormInput } from "./FormInput";
import { TOptionProps } from "@/lib/types";

type TSelectInput = {
  options: TOptionProps[];
} & TFormInput;

export const MFormSelect = ({
  label,
  name,
  formHandler,
  image,
  imageClassName,
  value,
  readOnly,
  options,
  ...props
}: TSelectInput) => {
  return (
    <div className="flex items-center space-x-4 mb-4 relative">
      {image ? (
        <Image
          src={image}
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
          <Field
            data-invalid={fieldState.invalid}
            className="flex items-center  gap-0!"
          >
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
};
