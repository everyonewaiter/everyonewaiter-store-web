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
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  return useMemo(
    () => ({
      name: fieldContext.name,
      formItemId: `${fieldContext.name}-form-item`,
      formDescriptionId: `${fieldContext.name}-form-item-description`,
      formMessageId: `${fieldContext.name}-form-item-message`,
      ...fieldState,
    }),
    [fieldContext.name, fieldState]
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
      <div data-slot="form-item" className={cn("grid gap-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  labelDisabled,
  ...props
}: ComponentProps<typeof LabelPrimitive.Root> & {
  labelDisabled?: boolean;
}) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive mb-[4px]", className)}
      htmlFor={formItemId}
      disabled={labelDisabled}
      {...props}
    />
  );
}

function FormControl({ ...props }: ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : `${formDescriptionId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
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
      className={cn("lg:text-s flex items-center gap-0.5 text-xs text-gray-400", className)}
      {...props}
    >
      {error?.message}
    </div>
  );
}

function FormInput({ ...props }: ComponentProps<typeof Input>) {
  const { error } = useFormField();
  return (
    <Input {...props} className={cn(props.className, error?.message && "border-status-error")} />
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
};
