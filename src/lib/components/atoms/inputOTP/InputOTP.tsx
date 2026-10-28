'use client';

import { cn } from 'cnfast';
import { OTPInput } from 'input-otp';
import * as React from 'react';

const InputOTP = ({
	className,
	containerClassName,
	...props
}: React.ComponentProps<typeof OTPInput> & {
	containerClassName?: string;
}) => (
	<OTPInput
		data-slot="input-otp"
		containerClassName={cn('cn-input-otp flex items-center has-disabled:opacity-50', containerClassName)}
		spellCheck={false}
		className={cn('disabled:cursor-not-allowed', className)}
		{...props}
	/>
);

export { InputOTP };
