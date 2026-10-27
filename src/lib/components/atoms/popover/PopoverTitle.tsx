import cn from 'cnfast';
import React from 'react';

const PopoverTitle = ({ className, ...props }: React.ComponentProps<'h2'>) => (
	<div data-slot="popover-title" className={cn('font-medium', className)} {...props} />
);

export default PopoverTitle;
