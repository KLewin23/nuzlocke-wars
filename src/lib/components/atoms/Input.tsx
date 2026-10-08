import * as React from 'react';
import { VariantProps, cn, cva } from 'cnfast';

const buttonVariants = cva(
	'file:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 w-full min-w-0 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm',
	{
		variants: {
			variant: {
				default: 'bg-black/25 border-black/30 border font-sans placeholder:font-railroad-gothic placeholder:text-white/30 p-2 font-bold',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

const Input = ({
	className,
	variant = 'default',
	type,
	...props
}: React.ComponentProps<'input'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) => {
	return (
		<input
			type={type}
			data-variant={variant}
			data-slot="input"
			className={cn(buttonVariants({ variant, className }))}
			{...props}
		/>
	);
};

export { Input };
