import type { ChangeEvent, ComponentProps, ReactNode } from "react";
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
      render={({ field, fieldState }) => {
        const { onChange: inputOnChange, ...restInputProps } = inputProps ?? {};
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          // inputProps의 onChange가 있으면 먼저 실행 (포맷팅 등)
          if (inputOnChange) {
            inputOnChange(e);
            // inputOnChange에서 form.setValue를 호출하므로 field.onChange는 호출하지 않음
            // 하지만 inputOnChange가 form.setValue를 호출하지 않는 경우를 대비해 호출
            return;
          }
          // inputOnChange가 없으면 기본 field.onChange 호출
          field.onChange(e);
        };

        return (
          <FormItem className={formItemClassName}>
            {label && <FormLabel {...labelProps}>{label}</FormLabel>}
            <FormControl>
              <div className="relative flex items-center gap-2">
                <FormInput {...field} {...restInputProps} onChange={handleChange} />
                {postfix}
              </div>
            </FormControl>
            {fieldState.error ? (
              <FormErrorMessage />
            ) : (
              description && <FormDescription>{description}</FormDescription>
            )}
          </FormItem>
        );
      }}
    />
  );
}

export default FormField;
