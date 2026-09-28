import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';

const DropdownMenuGroup = ({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) => (
	<DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
);

export { DropdownMenuGroup };
