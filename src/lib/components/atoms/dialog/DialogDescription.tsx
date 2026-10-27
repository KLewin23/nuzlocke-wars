import cn from 'cnfast';
import { Dialog as DialogPrimitive } from 'radix-ui';

const DialogDescription = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) => (
	<DialogPrimitive.Description
		data-slot="dialog-description"
		className={cn(
			'text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3',
			className,
		)}
		{...props}
	/>
);

export { DialogDescription };
