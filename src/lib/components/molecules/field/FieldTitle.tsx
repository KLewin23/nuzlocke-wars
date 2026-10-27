import cn from 'cnfast';
import React, { type JSX } from 'react';

const FieldTitle = ({ className, ...props }: React.ComponentProps<'div'>): JSX.Element => (
	<div
		data-slot="field-label"
		className={cn(
			'flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50',
			className,
		)}
		{...props}
	/>
);

export { FieldTitle };
