import cn from 'cnfast';
import React, { type JSX } from 'react';

const FieldDescription = ({ className, ...props }: React.ComponentProps<'p'>): JSX.Element => (
	<p
		data-slot="field-description"
		className={cn(
			'text-muted-foreground text-left text-sm leading-normal font-normal group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5',
			'last:mt-0 nth-last-2:-mt-1',
			'[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
			className,
		)}
		{...props}
	/>
);

export { FieldDescription };

// function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
//   return (
// <p
//   data-slot="field-description"
//   className={cn(
//     "text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
//     "last:mt-0 nth-last-2:-mt-1",
//     "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
//     className
//   )}
//   {...props}
// />
//   )
// }
