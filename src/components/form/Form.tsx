import { type ComponentProps, createContext, useContext, useId, useMemo } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { Info } from "@/components/icons";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import cn from "@/lib/utils";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={useMemo(() => ({ name: props.name }), [props.name])}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const formItemContext = useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  if (!formItemContext) {
    throw new Error("useFormField should be used within <FormItem>");
  }

  return useMemo(
    () => ({
      name: fieldContext.name,
      formItemId: formItemContext.id,
      formDescriptionId: `${formItemContext.id}-description`,
      formMessageId: `${formItemContext.id}-message`,
      ...fieldState,
    }),
    [fieldContext.name, formItemContext.id, fieldState]
  );
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ className, ...props }: ComponentProps<"div">) {
  const id = useId();

  return (
    <FormItemContext.Provider value={useMemo(() => ({ id }), [id])}>
      <div data-slot="form-item" className={cn("grid gap-1 lg:gap-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  disabled,
  ...props
}: ComponentProps<typeof LabelPrimitive.Root> & {
  disabled?: boolean;
}) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      htmlFor={formItemId}
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive leading-normal", className)}
      disabled={disabled}
      {...props}
    />
  );
}

function FormControl({ ...props }: ComponentProps<typeof Slot>) {
  return <Slot data-slot="form-control" {...props} />;
}

function FormDescription({ className, ...props }: ComponentProps<"p">) {
  const { formDescriptionId, error } = useFormField();

  if (error?.message) {
    return null;
  }

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("lg:text-s text-gray-400 md:text-xs", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: ComponentProps<"p">) {
  const { formMessageId, error } = useFormField();

  if (!error?.message) {
    return null;
  }

  return (
    <div
      data-slot="form-message"
      id={formMessageId}
      className={cn("flex items-center gap-0.5 text-xs text-gray-400 lg:text-xs", className)}
      {...props}
    >
      {error?.message}
    </div>
  );
}

function FormInput({ ...props }: ComponentProps<typeof Input> & { "data-cy"?: string }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return (
    <Input
      id={formItemId}
      aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : `${formDescriptionId}`}
      aria-invalid={!!error}
      {...props}
      data-cy={props["data-cy"]}
      className={cn(props.className, error?.message && "border-status-error")}
    />
  );
}

function FormErrorMessage({ className, ...props }: ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : props.children;

  if (!body) {
    return null;
  }

  return (
    <span
      data-slot="form-message"
      id={formMessageId}
      className={cn("lg:text-s text-status-error flex items-center gap-0.5 text-xs", className)}
      {...props}
    >
      <Info className="stroke-status-error mb-px size-4" />
      {body}
    </span>
  );
}

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormErrorMessage,
  FormInput,
  useFormField,
};
