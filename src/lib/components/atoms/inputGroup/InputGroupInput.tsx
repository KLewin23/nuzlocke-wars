import cn from 'cnfast';
import React from 'react';
import { Input } from '@/atoms/Input';

const InputGroupInput = ({ className, ...props }: React.ComponentProps<'input'>) => (
	<Input
		data-slot="input-group-control"
		className={cn(
			'flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent',
			className,
		)}
		{...props}
	/>
);

export default InputGroupInput;
