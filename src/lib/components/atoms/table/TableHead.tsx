'use client';

import { cn } from 'cnfast';

const TableHead = ({ className, ...props }: React.ComponentProps<'th'>) => (
	<th
		data-slot="table-head"
		className={cn(
			'font-railroad-gothic text-center text-foreground h-10 px-2 align-middle font-medium whitespace-nowrap has-[[role=checkbox]]:pr-0',
			className,
		)}
		{...props}
	/>
);

export { TableHead };
