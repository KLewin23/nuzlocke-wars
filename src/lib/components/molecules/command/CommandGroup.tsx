import cn from 'cnfast';
import React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

const CommandGroup = ({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) => (
	<CommandPrimitive.Group
		data-slot="command-group"
		className={cn(
			'text-foreground **:[[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium',
			className,
		)}
		{...props}
	/>
);

export { CommandGroup };
