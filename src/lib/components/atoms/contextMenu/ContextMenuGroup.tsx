import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';

const ContextMenuGroup = ({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Group>) => (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
);

export { ContextMenuGroup };
