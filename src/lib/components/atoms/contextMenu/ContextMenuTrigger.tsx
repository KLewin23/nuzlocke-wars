import cn from 'cnfast';
import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';

const ContextMenuTrigger = ({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) => (
	<ContextMenuPrimitive.Trigger
		data-slot="context-menu-trigger"
		className={cn('select-none', className)}
		{...props}
	/>
);

export { ContextMenuTrigger };
