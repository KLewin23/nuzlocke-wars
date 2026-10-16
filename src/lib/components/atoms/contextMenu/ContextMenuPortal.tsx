import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';

const ContextMenuPortal = ({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) => (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
);

export { ContextMenuPortal };
