import cn from 'cnfast';
import { Dialog as DialogPrimitive } from 'radix-ui';

const DialogTitle = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) => (
	<DialogPrimitive.Title
		data-slot="dialog-title"
		className={cn('cn-font-heading font-railroad-gothic text-xl leading-none font-bold', className)}
		{...props}
	/>
);

export { DialogTitle };
