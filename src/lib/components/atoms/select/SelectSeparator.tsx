import cn from 'cnfast';
import React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';

const SelectSeparator = ({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) => (
	<SelectPrimitive.Separator
		data-slot="select-separator"
		className={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
		{...props}
	/>
);

export { SelectSeparator };
