import cn from 'cnfast';
import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';

const ContextMenuContent = ({
	className,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content> & {
	side?: 'top' | 'right' | 'bottom' | 'left';
}) => (
	<ContextMenuPrimitive.Portal>
		<ContextMenuPrimitive.Content
			data-slot="context-menu-content"
			className={cn(
				'bg-popover text-popover-foreground ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-50 max-h-(--radix-context-menu-content-available-height) min-w-36 origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg p-1 shadow-md ring-1 duration-100',
				className,
			)}
			{...props}
		/>
	</ContextMenuPrimitive.Portal>
);

export { ContextMenuContent };
