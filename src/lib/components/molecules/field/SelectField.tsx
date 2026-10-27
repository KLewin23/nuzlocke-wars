import type { RHFProps } from '@/type/form';
import { Controller } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Select, type SelectProps, SelectTrigger, SelectValue } from '@/atoms/select';

import { Field } from './Field';
import { FieldError } from './FieldError';
import { FieldLabel } from './FieldLabel';

interface SelectFieldProps {
	label?: string;
	placeholder?: string;
}

const SelectField = <T extends FieldValues, N extends FieldPath<T>>({
	control,
	name,
	rules,
	label,
	children,
	placeholder,
	...selectProps
}: SelectProps & RHFProps<T, N> & SelectFieldProps) => {
	const fieldId = `form-rhf-select-${name}`;
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid} data-disabled={selectProps.disabled}>
					{label ?
						<FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
					:	null}
					<Select name={field.name} value={field.value} onValueChange={field.onChange} {...selectProps}>
						<SelectTrigger id={fieldId} aria-invalid={fieldState.invalid} className="min-w-30">
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
						{children}
					</Select>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
};

export { SelectField };
