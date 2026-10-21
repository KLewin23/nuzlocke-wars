import cn from 'cnfast';
import React from 'react';

const PopoverDescription = ({ className, ...props }: React.ComponentProps<'p'>) => (
	<p data-slot="popover-description" className={cn('text-muted-foreground', className)} {...props} />
);

export default PopoverDescription;
