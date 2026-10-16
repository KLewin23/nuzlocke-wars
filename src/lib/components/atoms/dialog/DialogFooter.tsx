import cn from 'cnfast';
import Button from '@atoms/Button';
import { Dialog as DialogPrimitive } from 'radix-ui';

const DialogFooter = ({
	className,
	showCloseButton = false,
	children,
	...props
}: React.ComponentProps<'div'> & {
	showCloseButton?: boolean;
}) => (
	<div
		data-slot="dialog-footer"
		className={cn(
			'bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-end',
			className,
		)}
		{...props}
	>
		{children}
		{showCloseButton && (
			<DialogPrimitive.Close asChild>
				<Button>Close</Button>
			</DialogPrimitive.Close>
		)}
	</div>
);

export { DialogFooter };
