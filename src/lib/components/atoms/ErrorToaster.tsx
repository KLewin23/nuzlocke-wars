'use client';

import { toast } from 'sonner';
import { Fragment, useEffect } from 'react';

interface Props {
	error?:
		| string
		| {
				title: string;
				description: string;
		  };
}

const ErrorToaster = ({ error }: Props) => {
	useEffect(() => {
		if (error)
			toast.error(
				typeof error === 'string' ? error : error.title,
				typeof error === 'string' ? undefined : { description: error.description },
			);
	}, [error]);
	return <Fragment />;
};

export default ErrorToaster;
