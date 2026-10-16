import cn from 'cnfast';
import Button from '@atoms/Button';
import { XIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';

import { DialogPortal } from './DialogPortal';
import { DialogOverlay } from './DialogOverlay';

const DialogContent = ({
	className,
	children,
	showCloseButton = true,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	showCloseButton?: boolean;
}) => (
	<DialogPortal>
		<DialogOverlay />
		<DialogPrimitive.Content
			data-slot="dialog-content"
			className={cn(
				'bg-popover text-popover-foreground ring-outline data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 p-4 text-sm ring-1 duration-100 outline-none sm:max-w-sm',
				className,
			)}
			{...props}
		>
			{children}
			{showCloseButton && (
				<DialogPrimitive.Close data-slot="dialog-close" asChild>
					<Button variant="ghost" className="absolute size-6 top-2 right-2">
						<XIcon className="size-6" />
						<span className="sr-only">Close</span>
					</Button>
				</DialogPrimitive.Close>
			)}
		</DialogPrimitive.Content>
	</DialogPortal>
);

export { DialogContent };
