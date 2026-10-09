import * as React from 'react';
import { Slot } from 'radix-ui';
import { type VariantProps, cn, cva } from 'cnfast';

const buttonVariants = cva(
	"group/button inline-flex shrink-0 cursor-pointer items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default: 'font-railroad-gothic p-2.5 hover:pt-[8px] hover:pb-[12px] transition-all duration-200',
				ghost: 'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			palette: {
				default: 'bg-none text-white',
				gold: 'gradient-gold text-black',
				blackOnWhite: 'bg-white text-black',
			},
		},
		defaultVariants: {
			variant: 'default',
			palette: 'default',
		},
	},
);

const Button = ({
	className,
	variant = 'default',
	palette = 'default',
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) => {
	const Comp = asChild ? Slot.Root : 'button';

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-palette={palette}
			className={cn(buttonVariants({ variant, className, palette }))}
			{...props}
		/>
	);
};

export default Button;
