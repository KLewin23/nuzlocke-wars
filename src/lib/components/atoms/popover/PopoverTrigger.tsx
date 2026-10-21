import { Popover as PopoverPrimitive } from 'radix-ui';

const PopoverTrigger = ({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) => (
	<PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
);

export { PopoverTrigger };
