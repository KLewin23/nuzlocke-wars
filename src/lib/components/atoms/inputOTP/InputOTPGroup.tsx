'use client';

import { cn } from 'cnfast';
import * as React from 'react';

const InputOTPGroup = ({ className, ...props }: React.ComponentProps<'div'>) => (
	<div
		data-slot="input-otp-group"
		className={cn(
			'has-aria-invalid:border-destructive has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 flex items-center rounded-lg has-aria-invalid:ring-3',
			className,
		)}
		{...props}
	/>
);

export { InputOTPGroup };
