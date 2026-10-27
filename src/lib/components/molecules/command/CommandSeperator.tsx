import cn from 'cnfast';
import React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

const CommandSeparator = ({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) => (
	<CommandPrimitive.Separator
		data-slot="command-separator"
		className={cn('bg-border -mx-1 h-px', className)}
		{...props}
	/>
);

export default CommandSeparator;
