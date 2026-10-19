import cn from 'cnfast';
import React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';

const SelectGroup = ({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) => (
	<SelectPrimitive.Group data-slot="select-group" className={cn('scroll-my-1 p-1', className)} {...props} />
);

export { SelectGroup };
