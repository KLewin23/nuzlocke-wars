import cn from 'cnfast';
import Label from '@/atoms/Label';
import React, { type JSX } from 'react';

const FieldLabel = ({ className, ...props }: React.ComponentProps<typeof Label>): JSX.Element => (
	<Label
		data-slot="field-label"
		className={cn(
			'font-railroad-gothic group/field-label peer/field-label has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-muted/50 has-[>[data-slot=field]]:has-[:focus-visible]:border-ring has-[>[data-slot=field]]:has-[:focus-visible]:ring-ring/50 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border has-[>[data-slot=field]]:has-[:focus-visible]:ring-3 *:data-[slot=field]:p-2.5',
			'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
			className,
		)}
		{...props}
	/>
);

export { FieldLabel };
