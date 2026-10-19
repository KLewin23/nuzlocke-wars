import cn from 'cnfast';
import React from 'react';

const InputGroupText = ({ className, ...props }: React.ComponentProps<'span'>) => (
	<span
		className={cn(
			"text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
			className,
		)}
		{...props}
	/>
);

export default InputGroupText;
