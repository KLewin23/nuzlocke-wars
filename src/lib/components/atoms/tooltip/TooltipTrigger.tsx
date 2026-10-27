import cn from 'cnfast';
import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';

const TooltipTrigger = ({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) => (
	<TooltipPrimitive.Trigger data-slot="tooltip-trigger" className={cn('w-full', props.className)} {...props} />
);

export { TooltipTrigger };
