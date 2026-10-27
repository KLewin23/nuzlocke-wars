import cn from 'cnfast';
import React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

const Command = ({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) => (
	<CommandPrimitive
		data-slot="command"
		className={cn(
			'bg-popover text-popover-foreground flex size-full flex-col overflow-hidden p-1',
			className,
		)}
		{...props}
	/>
);

export { Command };
