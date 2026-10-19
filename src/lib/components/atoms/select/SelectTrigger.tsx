import cn from 'cnfast';
import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Select as SelectPrimitive } from 'radix-ui';

const SelectTrigger = ({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) => (
	<SelectPrimitive.Trigger
		data-slot="select-trigger"
		className={cn(
			"font-railroad-gothic focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foregroun flex h-full w-fit grow items-center justify-between gap-1.5 border border-black/30 bg-black/20 py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-[size=default]:h-8 data-[size=sm]:h-7 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
			className,
		)}
		{...props}
	>
		{children}
		<SelectPrimitive.Icon asChild>
			<ChevronDownIcon className="text-muted-foreground pointer-events-none size-4" />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
);

export { SelectTrigger };
