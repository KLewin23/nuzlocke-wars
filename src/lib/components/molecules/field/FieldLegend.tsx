import cn from 'cnfast';
import React, { type JSX } from 'react';

const FieldLegend = ({
	className,
	variant = 'legend',
	...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }): JSX.Element => (
	<legend
		data-slot="field-legend"
		data-variant={variant}
		className={cn('mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base', className)}
		{...props}
	/>
);

export { FieldLegend };
