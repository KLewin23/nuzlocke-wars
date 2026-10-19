import cn from 'cnfast';
import React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';

const SelectLabel = ({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) => (
	<SelectPrimitive.Label
		data-slot="select-label"
		className={cn('text-muted-foreground px-1.5 py-1 text-xs', className)}
		{...props}
	/>
);

export { SelectLabel };
