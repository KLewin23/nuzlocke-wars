import cn from 'cnfast';
import React, { type JSX } from 'react';

const FieldContent = ({ className, ...props }: React.ComponentProps<'div'>): JSX.Element => (
	<div
		data-slot="field-content"
		className={cn('group/field-content flex flex-1 flex-col gap-0.5 leading-snug', className)}
		{...props}
	/>
);

export { FieldContent };
