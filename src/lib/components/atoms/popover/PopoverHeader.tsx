import cn from 'cnfast';
import React from 'react';

const PopoverHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
	<div data-slot="popover-header" className={cn('flex flex-col gap-0.5 text-sm', className)} {...props} />
);

export default PopoverHeader;
