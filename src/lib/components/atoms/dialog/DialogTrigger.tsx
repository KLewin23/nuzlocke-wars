import { Dialog as DialogPrimitive } from 'radix-ui';

const DialogTrigger = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) => (
	<DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
);

export { DialogTrigger };
