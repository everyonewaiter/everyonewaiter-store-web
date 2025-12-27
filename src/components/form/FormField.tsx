import type { ComponentProps, ReactNode } from "react";
import {
  FormField as FormFieldComponent,
  FormItem,
  FormLabel,
  FormControl,
  FormErrorMessage,
  FormInput,
  FormDescription,
} from "@/components/form/Form";
import Input from "@/components/ui/Input";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  name: TName;
  label: string;
  inputProps?: ComponentProps<typeof Input>;
  labelProps?: ComponentProps<typeof FormLabel>;
  formItemClassName?: string;
  postfix?: ReactNode;
  description?: ReactNode;
}

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  inputProps,
  labelProps,
  formItemClassName,
  postfix,
  description,
  ...props
}: Readonly<FormFieldProps<TFieldValues, TName>>) {
  return (
    <FormFieldComponent
      {...props}
      render={({ field, fieldState }) => (
        <FormItem className={formItemClassName}>
          {label && <FormLabel {...labelProps}>{label}</FormLabel>}
          <FormControl>
            <div className="relative flex items-center gap-2">
              <FormInput {...field} {...inputProps} />
              {postfix}
            </div>
          </FormControl>
          {fieldState.error ? (
            <FormErrorMessage />
          ) : (
            description && <FormDescription>{description}</FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}

export default FormField;
