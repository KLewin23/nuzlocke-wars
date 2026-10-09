'use client';

import { cn } from 'cnfast';

const TableCell = ({ className, ...props }: React.ComponentProps<'td'>) => (
	<td
		data-slot="table-cell"
		className={cn('font-bold p-2 align-middle text-center whitespace-nowrap has-[[role=checkbox]]:pr-0', className)}
		{...props}
	/>
);

export { TableCell };
