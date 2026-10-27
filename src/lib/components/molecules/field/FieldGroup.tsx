import cn from 'cnfast';
import React, { type JSX } from 'react';

const FieldGroup = ({ className, ...props }: React.ComponentProps<'div'>): JSX.Element => (
	<div
		data-slot="field-group"
		className={cn(
			'group/field-group grow @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4',
			className,
		)}
		{...props}
	/>
);

export { FieldGroup };
