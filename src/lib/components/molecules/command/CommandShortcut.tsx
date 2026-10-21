import cn from 'cnfast';
import React from 'react';

const CommandShortcut = ({ className, ...props }: React.ComponentProps<'span'>) => (
	<span
		data-slot="command-shortcut"
		className={cn(
			'text-muted-foreground group-data-selected/command-item:text-foreground ml-auto text-xs tracking-widest',
			className,
		)}
		{...props}
	/>
);

export default CommandShortcut;
