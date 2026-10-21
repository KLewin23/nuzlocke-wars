import cn from 'cnfast';
import React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

const CommandEmpty = ({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) => (
	<CommandPrimitive.Empty
		data-slot="command-empty"
		className={cn('py-6 text-center text-sm text-popover-foreground', className)}
		{...props}
	/>
);

export { CommandEmpty };
