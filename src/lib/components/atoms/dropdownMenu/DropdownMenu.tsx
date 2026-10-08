import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';

const DropdownMenu = ({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) => (
     <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
)

export { DropdownMenu };
