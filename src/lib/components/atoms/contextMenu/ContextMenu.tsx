import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';

const ContextMenu = ({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Root>) => (
	<ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
);

export { ContextMenu };
