import { FormField as FormFieldComponent, FormItem, FormLabel, FormControl, FormErrorMessage, FormInput } from '@/components/form/Form';
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import Input from '../ui/Input';

interface FormFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'> {
	name: TName;
	label: string;
	inputProps?: React.ComponentProps<typeof Input>;
	labelProps?: React.ComponentProps<typeof FormLabel>;
	formItemClassName?: string;
}

function FormField<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ label, inputProps, labelProps, formItemClassName, ...props }: FormFieldProps<TFieldValues, TName>) {
	return (
		<FormFieldComponent			
			{...props}
			render={({ field }) => (
				<FormItem className={formItemClassName}>
					<FormLabel {...labelProps}>{ label }</FormLabel>
					<FormControl>
						<FormInput {...field} {...inputProps} />
					</FormControl>
					<FormErrorMessage />
				</FormItem>
			)}
		/>
	)
}

export default FormField;