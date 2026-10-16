import { Dialog as DialogPrimitive } from 'radix-ui';

const DialogClose = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) => (
	<DialogPrimitive.Close data-slot="dialog-close" {...props} />
);

export { DialogClose };
