'use client';

import cn from 'cnfast';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface Props {
	message: string;
	toastMessage?: string;
	className?: string;
}

const ErrorFallback = ({ message, toastMessage = message, className }: Props) => {
	useEffect(() => {
		toast(toastMessage);
	}, []);

	return <p className={cn('font-white font-sans text-lg', className)}>{message}</p>;
};

export { ErrorFallback };
