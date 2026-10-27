import cn from 'cnfast';
import React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

const CommandList = ({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) => (
	<CommandPrimitive.List
		data-slot="command-list"
		className={cn('no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none', className)}
		{...props}
	/>
);

export { CommandList };
