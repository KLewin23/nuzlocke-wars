import { toast } from 'sonner';
import type { FieldError, FieldErrors, FieldPath, FieldValues } from 'react-hook-form';

import { getFromPath } from './object';

const getObjectDotString = <T extends FieldValues>(path: FieldPath<T>, object: FieldErrors<T>) => {
	const splitPath = path.split('.');
	return getFromPath(object, splitPath) as FieldError | undefined;
};

const toastErrorMesage = <T extends FieldValues, N extends FieldPath<T>>(
	fieldList: Array<N>,
	errors: FieldErrors<T>,
	checkStringDotNotation = false,
) => {
	const firstError = fieldList.reduce<FieldError | undefined>((acc, name) => {
		if (acc !== undefined) return acc;
		return (
			checkStringDotNotation ? getObjectDotString(name, errors)
			: name in errors ? (errors[name] as FieldError | undefined)
			: undefined
		);
	}, undefined);

	toast('Field validation error', {
		description:
			firstError?.message !== undefined && firstError?.message !== '' ?
				firstError?.message
			:	'Unknown validation error occurred.',
	});
};

export default toastErrorMesage;
