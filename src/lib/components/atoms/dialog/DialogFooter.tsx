import cn from 'cnfast';
import { X } from 'lucide-react';
import Button from '@/atoms/Button';
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
			'bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t border-t-black/30 p-4 sm:flex-row justify-between',
			className,
		)}
		{...props}
	>
		{showCloseButton && (
			<DialogPrimitive.Close asChild>
				<Button palette="blackOnWhite">
					<X />
					Close
				</Button>
			</DialogPrimitive.Close>
		)}
		{children}
	</div>
);

export { DialogFooter };
