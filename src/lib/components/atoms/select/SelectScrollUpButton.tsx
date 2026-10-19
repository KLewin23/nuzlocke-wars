import cn from 'cnfast';
import React from 'react';
import { ChevronUpIcon } from 'lucide-react';
import { Select as SelectPrimitive } from 'radix-ui';

const SelectScrollUpButton = ({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) => (
	<SelectPrimitive.ScrollUpButton
		data-slot="select-scroll-up-button"
		className={cn(
			"bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
			className,
		)}
		{...props}
	>
		<ChevronUpIcon />
	</SelectPrimitive.ScrollUpButton>
);

export { SelectScrollUpButton };
