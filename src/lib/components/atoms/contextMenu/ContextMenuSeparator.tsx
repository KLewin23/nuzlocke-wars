import cn from 'cnfast';
import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';

const ContextMenuSeparator = ({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) => (
	<ContextMenuPrimitive.Separator
		data-slot="context-menu-separator"
		className={cn('bg-border -mx-1 my-1 h-px', className)}
		{...props}
	/>
);

export { ContextMenuSeparator };
