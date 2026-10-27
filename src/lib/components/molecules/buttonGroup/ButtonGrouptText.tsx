import cn from 'cnfast';
import { Slot } from 'radix-ui';

const ButtonGroupText = ({
	className,
	asChild = false,
	...props
}: React.ComponentProps<'div'> & {
	asChild?: boolean;
}) => {
	const Comp = asChild ? Slot.Root : 'div';

	return (
		<Comp
			className={cn(
				"bg-muted flex items-center gap-2 rounded-lg border px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		/>
	);
};

export default ButtonGroupText;
