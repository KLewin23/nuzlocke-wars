import type { RHFProps } from '@/type/form';
import { Controller } from 'react-hook-form';
import { Input, type InputProps } from '@/atoms/Input';
import type { FieldPath, FieldValues } from 'react-hook-form';

import { Field } from './Field';
import { FieldError } from './FieldError';
import { FieldLabel } from './FieldLabel';

type RHFInputProps<T extends FieldValues, N extends FieldPath<T>> = RHFProps<T, N> & {
	label?: string;
	showError?: boolean;
};

const InputField = <T extends FieldValues, N extends FieldPath<T>>({
	control,
	name,
	rules,
	label,
	showError = false,
	...inputProps
}: InputProps & RHFInputProps<T, N>) => {
	const fieldId = `form-rhf-input-${name}`;
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid} data-disabled={inputProps.disabled}>
					{label ?
						<FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
					:	null}
					<Input {...field} {...inputProps} id={fieldId} aria-invalid={fieldState.invalid} />
					{fieldState.invalid && showError ?
						<FieldError errors={[fieldState.error]} />
					:	null}
				</Field>
			)}
		/>
	);
};

export { InputField };
